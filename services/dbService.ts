import { 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    collection, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    limit, 
    addDoc, 
    deleteDoc,
    onSnapshot,
    serverTimestamp,
    increment,
    getDocFromServer
} from 'firebase/firestore';
import { 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut,
    onAuthStateChanged,
    User as FirebaseUser,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult,
    signInWithCustomToken
} from 'firebase/auth';
import { db, auth, googleProvider } from '../src/firebase';
import type { User, Challenge, Announcement, Assignment, Submission, RewardItem } from '../types';

let confirmationResult: ConfirmationResult | null = null;

const toISODateString = (date: Date) => date.toISOString().split('T')[0];

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const dbService = {
    // --- Auth Management ---
    onAuthChange: (callback: (user: User | null) => void) => {
        return onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    if (userDoc.exists()) {
                        callback(userDoc.data() as User);
                    } else {
                        // Create user profile if it doesn't exist (e.g. after phone auth)
                        const newUser: User = {
                            id: firebaseUser.uid,
                            name: firebaseUser.displayName || 'Eco Champ',
                            avatar: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/100/100`,
                            points: 0,
                            completedChallenges: [],
                            completedAssignments: [],
                            dailyStreak: 1,
                            lastLoginDate: toISODateString(new Date()),
                            role: 'student',
                            language: 'en',
                            phone: firebaseUser.phoneNumber || undefined,
                            email: firebaseUser.email || undefined
                        };
                        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
                        callback(newUser);
                    }
                } catch (error) {
                    handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
                }
            } else {
                callback(null);
            }
        });
    },

    loginWithGoogle: async (): Promise<User | null> => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                return userDoc.data() as User;
            } else {
                // Create new user if doesn't exist
                const newUser: User = {
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName || 'Eco Champ',
                    avatar: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/100/100`,
                    points: 0,
                    completedChallenges: [],
                    completedAssignments: [],
                    dailyStreak: 1,
                    lastLoginDate: toISODateString(new Date()),
                    role: 'student',
                    language: 'en', // Default for Google login
                };
                await setDoc(userDocRef, newUser);
                return newUser;
            }
        } catch (error: any) {
            console.error('Google Login Error:', error);
            throw error;
        }
    },

    login: async (email: string, pass: string): Promise<User | null> => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, pass);
            const userDoc = await getDoc(doc(db, 'users', result.user.uid));
            return userDoc.exists() ? (userDoc.data() as User) : null;
        } catch (error: any) {
            console.error('Login Error:', error);
            throw error;
        }
    },

    signUp: async (email: string, pass: string, name: string, language: string): Promise<User | null> => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, pass);
            const newUser: User = {
                id: result.user.uid,
                name: name,
                avatar: `https://picsum.photos/seed/${name}/100/100`,
                points: 0,
                completedChallenges: [],
                completedAssignments: [],
                dailyStreak: 1,
                lastLoginDate: toISODateString(new Date()),
                role: 'student',
                language: language,
            };
            await setDoc(doc(db, 'users', result.user.uid), newUser);
            return newUser;
        } catch (error: any) {
            console.error('Sign Up Error:', error);
            throw error;
        }
    },

    logout: () => signOut(auth),

    sendEmailOTP: async (email: string): Promise<{ previewUrl?: string }> => {
        try {
            const response = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to send OTP');
            return data;
        } catch (error) {
            console.error('Error in sendEmailOTP:', error);
            throw error;
        }
    },

    setupRecaptcha: (containerId: string) => {
        if (!(window as any).recaptchaVerifier) {
            (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
                'size': 'invisible',
                'callback': () => {
                    console.log('Recaptcha resolved');
                }
            });
        }
    },

    sendPhoneOTP: async (phoneNumber: string): Promise<void> => {
        try {
            const appVerifier = (window as any).recaptchaVerifier;
            if (!appVerifier) throw new Error("Recaptcha not initialized");
            confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        } catch (error) {
            console.error('Error sending phone OTP:', error);
            throw error;
        }
    },

    verifyOTP: async (otp: string, identifier: string, method: 'email' | 'phone'): Promise<User | null> => {
        try {
            let firebaseUser: FirebaseUser | null = null;

            if (method === 'phone') {
                if (!confirmationResult) {
                    throw new Error('No pending phone verification. Please request a new OTP.');
                }
                const result = await confirmationResult.confirm(otp);
                firebaseUser = result.user;
            } else {
                // Verify email OTP via backend
                const response = await fetch('/api/auth/verify-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: identifier, otp }),
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Invalid OTP');
                
                // Sign in with the custom token returned by the backend
                const result = await signInWithCustomToken(auth, data.customToken);
                firebaseUser = result.user;
            }

            if (firebaseUser) {
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                if (userDoc.exists()) {
                    return userDoc.data() as User;
                } else {
                    const newUser: User = {
                        id: firebaseUser.uid,
                        name: 'Eco Champ',
                        avatar: `https://picsum.photos/seed/${identifier}/100/100`,
                        points: 0,
                        completedChallenges: [],
                        completedAssignments: [],
                        dailyStreak: 1,
                        lastLoginDate: toISODateString(new Date()),
                        role: 'student',
                        language: 'en',
                        [method === 'email' ? 'email' : 'phone']: identifier
                    };
                    await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
                    return newUser;
                }
            }
            return null;
        } catch (error: any) {
            console.error('OTP Verification Error:', error);
            throw error;
        }
    },

    checkInUser: async (userId: string): Promise<User> => {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) throw new Error("User not found");
        
        const user = userDoc.data() as User;
        const today = toISODateString(new Date());
        const yesterday = toISODateString(new Date(Date.now() - 86400000));

        if (user.lastLoginDate !== today) {
            const newStreak = user.lastLoginDate === yesterday ? user.dailyStreak + 1 : 1;
            await updateDoc(userDocRef, {
                dailyStreak: newStreak,
                lastLoginDate: today
            });
            return { ...user, dailyStreak: newStreak, lastLoginDate: today };
        }
        return user;
    },

    getUsers: async (): Promise<User[]> => {
        const path = 'users';
        try {
            const q = query(collection(db, path), orderBy('points', 'desc'), limit(50));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => doc.data() as User);
        } catch (error) {
            handleFirestoreError(error, OperationType.LIST, path);
            return [];
        }
    },

    // --- Challenge & Points ---
    completeChallenge: async (userId: string, challenge: Challenge, proofUrl: string): Promise<User> => {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        const user = userDoc.data() as User;

        if (user.completedChallenges.some(c => c.challengeId === challenge.id)) {
            return user;
        }

        const newCompletedChallenge = {
            challengeId: challenge.id,
            challengeTitle: challenge.title,
            pointsAwarded: challenge.points,
            dateCompleted: new Date().toISOString(),
            proofUrl,
        };

        const newSubmission: Submission = {
            id: `sub-${Date.now()}`,
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            type: 'challenge',
            sourceId: challenge.id,
            title: challenge.title,
            pointsAwarded: challenge.points,
            proofUrl,
            status: 'approved',
            submittedAt: new Date().toISOString()
        };

        await updateDoc(userDocRef, {
            points: increment(challenge.points),
            completedChallenges: [...user.completedChallenges, newCompletedChallenge]
        });
        await setDoc(doc(db, 'submissions', newSubmission.id), newSubmission);

        return { 
            ...user, 
            points: user.points + challenge.points, 
            completedChallenges: [...user.completedChallenges, newCompletedChallenge] 
        };
    },

    completeAssignment: async (userId: string, assignment: Assignment, proofUrl: string): Promise<User> => {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        const user = userDoc.data() as User;

        if (user.completedAssignments.some(a => a.assignmentId === assignment.id)) {
            return user;
        }

        const newCompletedAssignment = {
            assignmentId: assignment.id,
            assignmentTitle: assignment.title,
            pointsAwarded: assignment.points,
            dateCompleted: new Date().toISOString(),
            proofUrl,
        };

        const newSubmission: Submission = {
            id: `sub-${Date.now()}`,
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            type: 'assignment',
            sourceId: assignment.id,
            title: assignment.title,
            pointsAwarded: assignment.points,
            proofUrl,
            status: 'approved',
            submittedAt: new Date().toISOString()
        };

        await updateDoc(userDocRef, {
            points: increment(assignment.points),
            completedAssignments: [...user.completedAssignments, newCompletedAssignment]
        });
        await setDoc(doc(db, 'submissions', newSubmission.id), newSubmission);

        return { 
            ...user, 
            points: user.points + assignment.points, 
            completedAssignments: [...user.completedAssignments, newCompletedAssignment] 
        };
    },

    addQuizPoints: async (userId: string, points: number): Promise<User> => {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, {
            points: increment(points)
        });
        const userDoc = await getDoc(userDocRef);
        return userDoc.data() as User;
    },

    redeemReward: async (userId: string, cost: number): Promise<User> => {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, {
            points: increment(-cost)
        });
        const userDoc = await getDoc(userDocRef);
        return userDoc.data() as User;
    },

    confirmActionWithFingerprint: async (userId: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return !!auth.currentUser && auth.currentUser.uid === userId;
    },

    // --- Announcements ---
    getAnnouncements: async (): Promise<Announcement[]> => {
        const path = 'announcements';
        try {
            const snapshot = await getDocs(collection(db, path));
            return snapshot.docs.map(doc => doc.data() as Announcement);
        } catch (error) {
            handleFirestoreError(error, OperationType.LIST, path);
            return [];
        }
    },

    addAnnouncement: async (userId: string, text: string): Promise<Announcement[]> => {
        const newAnnouncement: Announcement = {
            id: `announcement-${Date.now()}`,
            text,
            timestamp: new Date().toISOString(),
        };
        await setDoc(doc(db, 'announcements', newAnnouncement.id), newAnnouncement);
        return dbService.getAnnouncements();
    },

    deleteAnnouncement: async (userId: string) => {
        const snapshot = await getDocs(collection(db, 'announcements'));
        const batch = snapshot.docs.map(d => deleteDoc(d.ref));
        await Promise.all(batch);
        return [];
    },

    // --- Assignments ---
    getAssignments: async (): Promise<Assignment[]> => {
        const path = 'assignments';
        try {
            const snapshot = await getDocs(collection(db, path));
            return snapshot.docs.map(doc => doc.data() as Assignment);
        } catch (error) {
            handleFirestoreError(error, OperationType.LIST, path);
            return [];
        }
    },

    addAssignment: async (userId: string, assignmentData: Omit<Assignment, 'id'>): Promise<Assignment[]> => {
        const id = `assign-${Date.now()}`;
        const newAssignment: Assignment = { id, ...assignmentData };
        await setDoc(doc(db, 'assignments', id), newAssignment);
        return dbService.getAssignments();
    },

    updateAssignment: async (userId: string, assignment: Assignment): Promise<Assignment[]> => {
        await setDoc(doc(db, 'assignments', assignment.id), assignment);
        return dbService.getAssignments();
    },

    deleteAssignment: async (userId: string, assignmentId: string): Promise<Assignment[]> => {
        await deleteDoc(doc(db, 'assignments', assignmentId));
        return dbService.getAssignments();
    },

    // --- Submissions ---
    getSubmissions: async (userId: string): Promise<Submission[]> => {
        const snapshot = await getDocs(collection(db, 'submissions'));
        return snapshot.docs.map(doc => doc.data() as Submission);
    },

    testConnection: async () => {
        try {
            await getDocFromServer(doc(db, 'test', 'connection'));
        } catch (error) {
            if(error instanceof Error && error.message.includes('the client is offline')) {
                console.error("Please check your Firebase configuration.");
            }
        }
    }
};
