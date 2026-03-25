
import type { ReactElement } from 'react';

export interface Challenge {
  id: string;
  title: string;
  description:string;
  points: number;
  category: string;
  // fix: Use ReactElement to avoid "Cannot find namespace 'JSX'" error.
  icon: ReactElement;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  image?: string;
}

export interface CompletedChallenge {
  challengeId: string;
  challengeTitle: string;
  pointsAwarded: number;
  dateCompleted: string;
  proofUrl: string; // In a real app, this would be a URL to uploaded storage
}

export interface CompletedAssignment {
  assignmentId: string;
  assignmentTitle: string;
  pointsAwarded: number;
  dateCompleted: string;
  proofUrl: string;
}

export interface User {
  id:string;
  name: string;
  avatar: string;
  points: number;
  completedChallenges: CompletedChallenge[];
  completedAssignments: CompletedAssignment[];
  password?: string;
  dailyStreak: number;
  lastLoginDate: string; // YYYY-MM-DD
  role: 'student' | 'teacher';
  language?: string;
  phone?: string;
  email?: string;
}

export interface Badge {
  name: string;
  description: string;
  // fix: Use ReactElement to avoid "Cannot find namespace 'JSX'" error.
  icon: ReactElement;
  threshold: number;
  type: 'points' | 'streak';
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  topic: string;
  questions: QuizQuestion[];
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  content: string; 
  icon: string; // emoji
}

export interface ChatbotMessage {
    sender: 'user' | 'bot';
    text: string;
}

export interface CommunityMessage {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    text: string;
    timestamp: string;
}

export interface Submission {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    type: 'challenge' | 'assignment';
    sourceId: string; // ID of the challenge or assignment
    title: string;
    pointsAwarded: number;
    proofUrl: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
}

export interface Assignment {
    id: string;
    title: string;
    description: string;
    points: number;
    assignedTo: 'all' | 'Class 5' | 'Class 6';
    dueDate: string;
}

export interface Announcement {
  id: string;
  text: string;
  timestamp: string;
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string; // emoji
}

export enum AppView {
  CHALLENGES = 'CHALLENGES',
  QUIZZES_HUB = 'QUIZZES_HUB',
  QUIZ_IN_PROGRESS = 'QUIZ_IN_PROGRESS',
  TEACHER_REVIEW = 'TEACHER_REVIEW',
  ASSIGNMENTS = 'ASSIGNMENTS',
  CHATBOT = 'CHATBOT',
  COMMUNITY_HUB = 'COMMUNITY_HUB',
  TEACHER_DASHBOARD = 'TEACHER_DASHBOARD',
  ECOSYSTEM_DONTS = 'ECOSYSTEM_DONTS',
  FUN_GAMES = 'FUN_GAMES',
  PROFILE = 'PROFILE',
  REWARDS_STORE = 'REWARDS_STORE',
  // fix: Add missing LEADERBOARD and COMMUNITY_FEED enum members to resolve errors in DynamicBackground.tsx.
  LEADERBOARD = 'LEADERBOARD',
  COMMUNITY_FEED = 'COMMUNITY_FEED',
}