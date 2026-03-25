
import { database } from './database';
import type { User, Challenge, CompletedChallenge, CommunityMessage, Announcement, Assignment, CompletedAssignment, Submission } from '../types';

// This file simulates the API endpoints of a backend server.
// It contains all the business logic and interacts with the database service.

// --- Simulate network latency ---
const FAKE_LATENCY = 300;
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const toISODateString = (date: Date) => date.toISOString().split('T')[0];

// --- Authorization Helpers ---
const findUser = (userId: string): User => {
    const user = database.collections.users.find(u => u.id === userId);
    if (!user) throw new Error("User not found");
    return user;
};

const isTeacher = (userId: string): boolean => {
    const user = findUser(userId);
    return user.role === 'teacher';
};

const isStudent = (userId: string): boolean => {
    const user = findUser(userId);
    return user.role === 'student';
};


// --- User Management API ---
export const login = async (name: string, pass: string): Promise<User | null> => {
    await delay(FAKE_LATENCY);
    const user = database.collections.users.find(u => u.name.toLowerCase() === name.toLowerCase() && u.password === pass);
    return user ? { ...user } : null; // Return a copy
};

export const signUp = async (name: string, pass: string): Promise<User | null> => {
    await delay(FAKE_LATENCY);
    if (database.collections.users.some(u => u.name.toLowerCase() === name.toLowerCase())) {
        return null; // User exists
    }
    const today = toISODateString(new Date());
    const newUser: User = {
        id: `user-${Date.now()}`,
        name: name,
        avatar: `https://picsum.photos/seed/${name}/100/100`,
        points: 0,
        completedChallenges: [],
        completedAssignments: [],
        password: pass,
        dailyStreak: 1,
        lastLoginDate: today,
        role: 'student', // New users default to student
    };
    database.collections.users.push(newUser);
    database.commit();
    return { ...newUser };
};

export const checkInUser = async (userId: string): Promise<User> => {
    await delay(FAKE_LATENCY / 2);
    const user = findUser(userId);
    const today = toISODateString(new Date());
    const yesterday = toISODateString(new Date(Date.now() - 86400000));

    if (user.lastLoginDate !== today) {
        user.dailyStreak = user.lastLoginDate === yesterday ? user.dailyStreak + 1 : 1;
        user.lastLoginDate = today;
        database.commit();
    }
    return { ...user };
};

export const getUsers = async (): Promise<User[]> => {
    await delay(FAKE_LATENCY);
    return [...database.collections.users];
};

// --- Challenge & Points API (Student-Only Actions) ---
export const completeChallenge = async (userId: string, challenge: Challenge, proofUrl: string): Promise<User> => {
    await delay(FAKE_LATENCY);
    if (!isStudent(userId)) {
        throw new Error("Authorization Error: Only students can complete challenges.");
    }
    const user = findUser(userId);
    
    if (user.completedChallenges.some(c => c.challengeId === challenge.id)) {
        return { ...user }; // Already completed
    }

    const newCompletedChallenge: CompletedChallenge = {
        challengeId: challenge.id,
        challengeTitle: challenge.title,
        pointsAwarded: challenge.points,
        dateCompleted: new Date().toISOString(),
        proofUrl,
    };

    user.points += challenge.points;
    user.completedChallenges.push(newCompletedChallenge);

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
    database.collections.submissions.push(newSubmission);
    database.commit();
    return { ...user };
};
    
export const completeAssignment = async (userId: string, assignment: Assignment, proofUrl: string): Promise<User> => {
    await delay(FAKE_LATENCY);
    if (!isStudent(userId)) {
        throw new Error("Authorization Error: Only students can complete assignments.");
    }
    const user = findUser(userId);
    
    if (!user.completedAssignments) user.completedAssignments = [];
    if (user.completedAssignments.some(a => a.assignmentId === assignment.id)) {
        return { ...user }; // Already completed
    }

    const newCompletedAssignment: CompletedAssignment = {
        assignmentId: assignment.id,
        assignmentTitle: assignment.title,
        pointsAwarded: assignment.points,
        dateCompleted: new Date().toISOString(),
        proofUrl,
    };

    user.points += assignment.points;
    user.completedAssignments.push(newCompletedAssignment);

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
    database.collections.submissions.push(newSubmission);
    database.commit();
    return { ...user };
};

export const addQuizPoints = async (userId: string, points: number): Promise<User> => {
    await delay(FAKE_LATENCY);
    if (!isStudent(userId)) {
        throw new Error("Authorization Error: Only students can earn quiz points.");
    }
    const user = findUser(userId);
    user.points += points;
    database.commit();
    return { ...user };
};

export const redeemReward = async (userId: string, cost: number): Promise<User> => {
    await delay(FAKE_LATENCY);
    if (!isStudent(userId)) {
        throw new Error("Authorization Error: Only students can redeem rewards.");
    }
    const user = findUser(userId);
    if (user.points < cost) throw new Error("Insufficient points");

    user.points -= cost;
    database.commit();
    return { ...user };
};

export const confirmActionWithFingerprint = async (userId: string): Promise<boolean> => {
    await delay(1500);
    return database.collections.users.some(u => u.id === userId);
};
    
// --- Community API (All Roles) ---
export const getCommunityMessages = async (): Promise<CommunityMessage[]> => {
    await delay(FAKE_LATENCY);
    return [...database.collections.communityMessages];
};

export const addCommunityMessage = async (payload: { userId: string; userName: string; userAvatar: string; text: string; }): Promise<CommunityMessage[]> => {
    await delay(FAKE_LATENCY);
    const newMessage: CommunityMessage = {
        id: `msg-${Date.now()}`,
        ...payload,
        timestamp: new Date().toISOString(),
    };
    database.collections.communityMessages.push(newMessage);
    if (database.collections.communityMessages.length > 50) {
        database.collections.communityMessages.shift();
    }
    database.commit();
    return [...database.collections.communityMessages];
};

// --- Teacher & Admin API (Teacher-Only Actions) ---
export const getAnnouncements = async (): Promise<Announcement[]> => {
    await delay(FAKE_LATENCY);
    return [...(database.collections.announcements || [])];
};

export const addAnnouncement = async (userId: string, text: string): Promise<Announcement[]> => {
    await delay(FAKE_LATENCY);
    if (!isTeacher(userId)) {
        throw new Error("Authorization Error: Only teachers can add announcements.");
    }
    const newAnnouncement: Announcement = {
        id: `announcement-${Date.now()}`,
        text,
        timestamp: new Date().toISOString(),
    };
    database.collections.announcements = [newAnnouncement];
    database.commit();
    return [...database.collections.announcements];
};

export const deleteAnnouncement = async (userId: string): Promise<Announcement[]> => {
    await delay(FAKE_LATENCY);
    if (!isTeacher(userId)) {
        throw new Error("Authorization Error: Only teachers can delete announcements.");
    }
    database.collections.announcements = [];
    database.commit();
    return [];
};

export const getAssignments = async (): Promise<Assignment[]> => {
    await delay(FAKE_LATENCY);
    return [...(database.collections.assignments || [])];
};

export const addAssignment = async (userId: string, assignmentData: Omit<Assignment, 'id'>): Promise<Assignment[]> => {
    await delay(FAKE_LATENCY);
    if (!isTeacher(userId)) {
        throw new Error("Authorization Error: Only teachers can add assignments.");
    }
    const newAssignment: Assignment = {
        id: `assign-${Date.now()}`,
        ...assignmentData,
    };
    if (!database.collections.assignments) database.collections.assignments = [];
    database.collections.assignments.push(newAssignment);
    database.commit();
    return [...database.collections.assignments];
};

export const updateAssignment = async (userId: string, updatedAssignment: Assignment): Promise<Assignment[]> => {
    await delay(FAKE_LATENCY);
    if (!isTeacher(userId)) {
        throw new Error("Authorization Error: Only teachers can update assignments.");
    }
    const index = (database.collections.assignments || []).findIndex(a => a.id === updatedAssignment.id);
    if (index === -1) throw new Error("Assignment not found");
    database.collections.assignments[index] = updatedAssignment;
    database.commit();
    return [...database.collections.assignments];
};

export const deleteAssignment = async (userId: string, assignmentId: string): Promise<Assignment[]> => {
    await delay(FAKE_LATENCY);
    if (!isTeacher(userId)) {
        throw new Error("Authorization Error: Only teachers can delete assignments.");
    }
    database.collections.assignments = (database.collections.assignments || []).filter(a => a.id !== assignmentId);
    database.commit();
    return [...database.collections.assignments];
};

export const getSubmissions = async (userId: string): Promise<Submission[]> => {
    await delay(FAKE_LATENCY);
    if (!isTeacher(userId)) {
        console.warn(`Unauthorized attempt to fetch submissions by user ${userId}.`);
        return []; // Return empty array for non-teachers to prevent data leakage
    }
    return [...database.collections.submissions];
}
