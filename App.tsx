
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppView, type User, type Challenge, type CommunityMessage, type Announcement, type Assignment, type RewardItem, type Submission } from './types';
import { INITIAL_CHALLENGES } from './constants';
import { dbService } from './services/dbService';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import QuizView from './components/QuizView';
import Login from './components/Login';
import TeacherReview from './components/TeacherReview';
import TeacherAssignment from './components/TeacherAssignment';
import StudentAssignment from './components/StudentAssignment';
import LearnView from './components/LearnView';
import QuizzesHubView from './components/QuizzesHubView';
import DynamicBackground from './components/DynamicBackground';
import CommunityHub from './components/CommunityHub';
import TeacherDashboard from './components/TeacherDashboard';
import LockedFeature from './components/LockedFeature';
import EcosystemDonts from './components/EcosystemDonts';
import OnboardingModal from './components/OnboardingModal';
import ProfileView from './components/ProfileView';
import RewardsStore from './components/RewardsStore';
import FunGames from './components/FunGames';
import SplashScreen from './components/SplashScreen';
import CursorSpotlight from './components/CursorSpotlight';


type Theme = 'light' | 'dark';


const App: React.FC = () => {
    const { i18n } = useTranslation();
    const [users, setUsers] = useState<User[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [activeView, setActiveView] = useState<AppView>(AppView.CHALLENGES);
    const [currentQuizTopic, setCurrentQuizTopic] = useState<string | null>(null);
    const [theme, setTheme] = useState<Theme>('light');
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showSplash, setShowSplash] = useState(true);
    
    // Derived state for daily task
    const dailyTask = INITIAL_CHALLENGES[new Date().getDate() % INITIAL_CHALLENGES.length];

    // Initial load for data accessible to all roles
    useEffect(() => {
        // Test connection on boot
        dbService.testConnection();

        const loadSharedData = async () => {
            setIsLoading(true);
            try {
                const [loadedUsers, loadedAnnouncements, loadedAssignments] = await Promise.all([
                    dbService.getUsers(),
                    dbService.getAnnouncements(),
                    dbService.getAssignments(),
                ]);
                setUsers(loadedUsers);
                setAnnouncements(loadedAnnouncements);
                setAssignments(loadedAssignments);
            } catch (error) {
                console.error("Error loading shared data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        // Listen for auth changes
        const unsubscribe = dbService.onAuthChange(async (user) => {
            if (user) {
                await handleLoginSuccess(user);
                await loadSharedData();
            } else {
                setCurrentUser(null);
                setSubmissions([]);
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (currentUser?.language) {
            i18n.changeLanguage(currentUser.language);
        }
    }, [currentUser, i18n]);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
    }, [theme]);
    

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const handleLoginSuccess = async (user: User, isNewUser: boolean = false) => {
        const checkedInUser = await dbService.checkInUser(user.id);
        setCurrentUser(checkedInUser);
        setUsers(prevUsers => {
            const exists = prevUsers.some(u => u.id === checkedInUser.id);
            if (exists) {
                return prevUsers.map(u => u.id === checkedInUser.id ? checkedInUser : u);
            }
            return [...prevUsers, checkedInUser];
        });
        
        // Role-based data fetching and view setting
        if (user.role === 'teacher') {
            const submissions = await dbService.getSubmissions(user.id);
            setSubmissions(submissions);
            setActiveView(AppView.TEACHER_DASHBOARD);
        } else {
            setSubmissions([]); // Ensure student doesn't see stale submission data
            setActiveView(AppView.CHALLENGES);
        }

        if (isNewUser) {
            setShowOnboarding(true);
        }
    };

    const handleLogin = async (email: string, pass: string): Promise<string | true> => {
        try {
            const user = await dbService.login(email, pass);
            if (user) return true;
            return "User data not found";
        } catch (error: any) {
            return error.message || "Login failed";
        }
    };
    
    const handleSignUp = async (email: string, pass: string, name: string, language: string): Promise<string | true> => {
        try {
            const newUser = await dbService.signUp(email, pass, name, language);
            if (newUser) return true;
            return "Failed to create user profile";
        } catch (error: any) {
            return error.message || "Sign up failed";
        }
    }

    const handleGoogleLogin = async () => {
        await dbService.loginWithGoogle();
    };

    const handleLogout = async () => {
        await dbService.logout();
        setCurrentUser(null);
        setSubmissions([]); // Clear submission data on logout
        setShowSplash(true); // Show splash screen again on logout
    };

    const handleCompleteChallenge = async (challenge: Challenge, proofUrl: string) => {
        if(!currentUser) return;
        const updatedUser = await dbService.completeChallenge(currentUser.id, challenge, proofUrl);
        setCurrentUser(updatedUser);
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        // New submission is created on the backend; teacher will see it on their next data fetch.
    };

    const handleCompleteAssignment = async (assignment: Assignment, proofUrl: string) => {
        if(!currentUser) return;
        const updatedUser = await dbService.completeAssignment(currentUser.id, assignment, proofUrl);
        setCurrentUser(updatedUser);
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        // New submission is created on the backend; teacher will see it on their next data fetch.
    };

    const handleStartQuiz = (topic: string) => {
        setCurrentQuizTopic(topic);
        setActiveView(AppView.QUIZ_IN_PROGRESS);
    };
    
    const handleQuizComplete = async (score: number) => {
        if (score > 0 && currentUser) {
            const updatedUser = await dbService.addQuizPoints(currentUser.id, score);
            setCurrentUser(updatedUser);
            setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        }
        setCurrentQuizTopic(null);
        setActiveView(AppView.QUIZZES_HUB);
    }

    const handleRedeemReward = async (item: RewardItem) => {
        if (!currentUser || currentUser.points < item.cost) {
            alert("Not enough points!");
            return;
        }
        try {
            const updatedUser = await dbService.redeemReward(currentUser.id, item.cost);
            setCurrentUser(updatedUser);
            setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
            alert(`Success! You have redeemed "${item.name}". Your new balance is ${updatedUser.points} points.`);
        } catch (error) {
            alert("Failed to redeem reward. Please try again.");
        }
    };

    const handleAddAnnouncement = async (text: string) => {
        if (!currentUser) return;
        const updatedAnnouncements = await dbService.addAnnouncement(currentUser.id, text);
        setAnnouncements(updatedAnnouncements);
    };
    
    const handleDeleteAnnouncement = async () => {
        if (!currentUser) return;
        const updatedAnnouncements = await dbService.deleteAnnouncement(currentUser.id);
        setAnnouncements(updatedAnnouncements);
    };

    const handleAddAssignment = async (assignmentData: Omit<Assignment, 'id'>) => {
        if (!currentUser) return;
        const updatedAssignments = await dbService.addAssignment(currentUser.id, assignmentData);
        setAssignments(updatedAssignments);
    };
    
    const handleUpdateAssignment = async (assignment: Assignment) => {
        if (!currentUser) return;
        const updatedAssignments = await dbService.updateAssignment(currentUser.id, assignment);
        setAssignments(updatedAssignments);
    };
    
    const handleDeleteAssignment = async (assignmentId: string) => {
        if (!currentUser) return;
        const updatedAssignments = await dbService.deleteAssignment(currentUser.id, assignmentId);
        setAssignments(updatedAssignments);
    };

    const handleUpdateCurrentUser = (updatedUser: User) => {
        setCurrentUser(updatedUser);
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    };
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
                    <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-primary"></div>
                </div>
            )
        }
        if (!currentUser) return null;

        if (activeView === AppView.QUIZ_IN_PROGRESS && currentQuizTopic) {
            return <QuizView topic={currentQuizTopic} onQuizComplete={handleQuizComplete} onBack={() => setActiveView(AppView.QUIZZES_HUB)} />;
        }

        switch (activeView) {
            case AppView.CHALLENGES:
                return (
                    <Dashboard
                        currentUser={currentUser}
                        dailyTask={dailyTask}
                        onCompleteChallenge={handleCompleteChallenge}
                        announcements={announcements}
                    />
                );
            case AppView.QUIZZES_HUB:
                return <QuizzesHubView onStartQuiz={handleStartQuiz} />;
            case AppView.CHATBOT:
                return <LearnView currentUser={currentUser} />;
            case AppView.COMMUNITY_HUB:
                return <CommunityHub 
                    currentUser={currentUser} 
                    allStudents={users.filter(u => u.role === 'student')} 
                  />;
            case AppView.ECOSYSTEM_DONTS:
                return <EcosystemDonts currentUser={currentUser} onCompleteChallenge={handleCompleteChallenge} />;
            case AppView.FUN_GAMES:
                return <FunGames />;
            case AppView.TEACHER_DASHBOARD:
                return currentUser.role === 'teacher' ? <TeacherDashboard
                    users={users.filter(u => u.role === 'student')}
                    assignments={assignments}
                    submissions={submissions}
                    announcement={announcements.length > 0 ? announcements[0] : null}
                    onAddAnnouncement={handleAddAnnouncement}
                    onDeleteAnnouncement={handleDeleteAnnouncement}
                    setActiveView={setActiveView}
                /> : null;
            case AppView.TEACHER_REVIEW:
                return currentUser.role === 'teacher' ? <TeacherReview initialSubmissions={submissions} /> : null;
            case AppView.ASSIGNMENTS:
                return currentUser.role === 'teacher' ? (
                    <TeacherAssignment 
                        assignments={assignments}
                        onAdd={handleAddAssignment}
                        onUpdate={handleUpdateAssignment}
                        onDelete={handleDeleteAssignment}
                    />
                ) : (
                    <StudentAssignment
                        assignments={assignments}
                        currentUser={currentUser}
                        onComplete={handleCompleteAssignment}
                    />
                );
            case AppView.PROFILE:
                return <ProfileView currentUser={currentUser} onUserUpdate={handleUpdateCurrentUser} />;
            case AppView.REWARDS_STORE:
                return <RewardsStore currentUser={currentUser} onRedeem={handleRedeemReward} />;
            default:
                return null;
        }
    };

    return (
        <>
            <CursorSpotlight />
            <DynamicBackground currentView={currentUser ? activeView : 'LOGIN'} />
            {showSplash && !currentUser && <SplashScreen onEnter={() => setShowSplash(false)} />}
            {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
            {!currentUser && !isLoading && !showSplash ? (
                <Login 
                    onLogin={handleLogin} 
                    onSignUp={handleSignUp}
                    onGoogleLogin={handleGoogleLogin}
                    onLoginSuccess={handleLoginSuccess}
                />
            ) : (
                currentUser && (
                    <div className="min-h-screen bg-transparent font-sans text-text-primary">
                        <Header
                            currentUser={currentUser}
                            activeView={activeView}
                            setActiveView={setActiveView}
                            onLogout={handleLogout}
                            theme={theme}
                            toggleTheme={toggleTheme}
                        />
                        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                            {renderContent()}
                        </main>
                    </div>
                )
            )}
        </>
    );
};

export default App;
