import type { User, Submission, CommunityMessage, Announcement, Assignment } from '../types';

// This file simulates a connection to a database.
// In a real-world application, this service would connect to a remote database
// like Firestore or MongoDB to allow for data persistence across devices.
// For this prototype, it uses the browser's localStorage.

interface AppDB {
    users: User[];
    submissions: Submission[];
    communityMessages: CommunityMessage[];
    announcements: Announcement[];
    assignments: Assignment[];
}

const DB_KEY = 'ecoChampsDb';

// --- INITIAL DATABASE STATE (used if localStorage is empty) ---
const getInitialDb = (): AppDB => ({
    users: [
        {
          id: 'user-1',
          name: 'Priya Sharma',
          avatar: 'https://picsum.photos/seed/priya/100/100',
          points: 250,
          completedChallenges: [
              { challengeId: 'waste-1', challengeTitle: 'Waste Segregation Master', pointsAwarded: 25, dateCompleted: '2023-10-26T10:00:00Z', proofUrl: 'https://images.unsplash.com/photo-1599059813005-7282b8841413?q=80&w=400' },
              { challengeId: 'water-1', challengeTitle: 'Water Audit', pointsAwarded: 20, dateCompleted: '2023-10-25T10:00:00Z', proofUrl: 'https://images.unsplash.com/photo-1549488344-cbb6c144e0b9?q=80&w=400' }
          ],
          completedAssignments: [],
          dailyStreak: 5,
          lastLoginDate: '2023-10-26',
          role: 'student',
          password: 'password123',
        },
        {
          id: 'user-2',
          name: 'Rohan Verma',
          avatar: 'https://picsum.photos/seed/rohan/100/100',
          points: 180,
          completedChallenges: [
              { challengeId: 'energy-1', challengeTitle: 'Unplug Power Vampires', pointsAwarded: 15, dateCompleted: '2023-10-26T11:00:00Z', proofUrl: 'https://images.unsplash.com/photo-1620317133811-e8b488585114?q=80&w=400' }
          ],
          completedAssignments: [],
          dailyStreak: 3,
          lastLoginDate: '2023-10-26',
          role: 'student',
          password: 'password123',
        },
         {
          id: 'user-3',
          name: 'Aisha Khan',
          avatar: 'https://picsum.photos/seed/aisha/100/100',
          points: 450,
          completedChallenges: [],
          completedAssignments: [],
          dailyStreak: 7,
          lastLoginDate: '2023-10-26',
          role: 'student',
          password: 'password123',
        },
        {
          id: 'user-4',
          name: 'Sameer Desai',
          avatar: 'https://picsum.photos/seed/sameer/100/100',
          points: 80,
          completedChallenges: [],
          completedAssignments: [],
          dailyStreak: 1,
          lastLoginDate: '2023-10-26',
          role: 'student',
          password: 'password123',
        },
        {
          id: 'teacher-1',
          name: 'Mr. Gupta',
          avatar: 'https://picsum.photos/seed/gupta/100/100',
          points: 0,
          completedChallenges: [],
          completedAssignments: [],
          dailyStreak: 10,
          lastLoginDate: '2023-10-26',
          role: 'teacher',
          password: 'teacherpassword',
        }
    ],
    submissions: [
        {
            id: 'sub-1',
            userId: 'user-1',
            userName: 'Priya Sharma',
            userAvatar: 'https://picsum.photos/seed/priya/100/100',
            type: 'challenge',
            sourceId: 'waste-2',
            title: 'DIY Compost Bin',
            pointsAwarded: 40,
            proofUrl: 'https://images.unsplash.com/photo-1593113646773-ae18c60a81d5?q=80&w=400',
            status: 'pending',
            submittedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        },
        {
            id: 'sub-2',
            userId: 'user-2',
            userName: 'Rohan Verma',
            userAvatar: 'https://picsum.photos/seed/rohan/100/100',
            type: 'challenge',
            sourceId: 'bio-1',
            title: 'Plant a Sapling',
            pointsAwarded: 30,
            proofUrl: 'https://images.unsplash.com/photo-1512428208316-802f00c73e04?q=80&w=400',
            status: 'pending',
            submittedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        },
         {
            id: 'sub-3',
            userId: 'user-3',
            userName: 'Aisha Khan',
            userAvatar: 'https://picsum.photos/seed/aisha/100/100',
            type: 'challenge',
            sourceId: 'climate-2',
            title: 'Eco-Pledge Poster',
            pointsAwarded: 25,
            proofUrl: 'https://images.unsplash.com/photo-1620121684816-7f48b94a3328?q=80&w=400',
            status: 'approved',
            submittedAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
        },
    ],
    assignments: [
        {
            id: 'assign-1',
            title: 'Research Local Biodiversity',
            description: 'Create a short report (1 page) on a native plant or animal in your area. Include its habitat, diet, and importance to the ecosystem.',
            points: 100,
            assignedTo: 'all',
            dueDate: new Date(Date.now() + 14 * 86400000).toISOString(), // 2 weeks from now
        },
        {
            id: 'assign-2',
            title: 'Home Energy Audit',
            description: 'Work with your parents to identify 5 ways your family can reduce electricity consumption at home. Create a poster explaining your findings.',
            points: 75,
            assignedTo: 'all',
            dueDate: new Date(Date.now() + 10 * 86400000).toISOString(), // 10 days from now
        }
    ],
    communityMessages: [
        { id: 'msg-1', userId: 'user-2', userName: 'Rohan Verma', userAvatar: 'https://picsum.photos/seed/rohan/100/100', text: 'Just finished the "Unplug Power Vampires" challenge! It\'s amazing how much energy we waste.', timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
        { id: 'msg-2', userId: 'user-1', userName: 'Priya Sharma', userAvatar: 'https://picsum.photos/seed/priya/100/100', text: 'I made my own compost bin today! It was so much fun. ♻️', timestamp: new Date(Date.now() - 10 * 60000).toISOString() },
        { id: 'msg-3', userId: 'user-3', userName: 'Aisha Khan', userAvatar: 'https://picsum.photos/seed/aisha/100/100', text: 'Has anyone started the local biodiversity assignment? I\'m thinking of researching the Indian Pangolin!', timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
    ],
    announcements: [],
});

class DatabaseService {
    private db!: AppDB;

    constructor() {
        this.loadDb();
    }

    private loadDb(): void {
        try {
            const savedDb = localStorage.getItem(DB_KEY);
            if (savedDb) {
                this.db = JSON.parse(savedDb);
            } else {
                this.db = getInitialDb();
                this.commit(); // Save initial state
            }
        } catch (error) {
            console.error("Failed to load database from localStorage. Initializing with default data.", error);
            this.db = getInitialDb();
        }
    }
    
    /**
     * Provides read-only access to the database collections.
     * To modify data, use methods on the service which will then commit the changes.
     */
    public get collections() {
        return this.db;
    }

    /**
     * Persists the current state of the database to localStorage.
     * This should be called after any mutation operation.
     */
    public commit(): void {
        try {
            localStorage.setItem(DB_KEY, JSON.stringify(this.db));
        } catch (error) {
            console.error("Failed to save database to localStorage:", error);
        }
    }
}


// Singleton instance of the DatabaseService to be used by the API.
export const database = new DatabaseService();
