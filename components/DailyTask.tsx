import React from 'react';
import type { Challenge, User } from '../types';
import ChallengeCard from './ChallengeCard';
import { FireIcon } from './icons';

interface DailyTaskProps {
    dailyTask: Challenge;
    currentUser: User;
    onSelectChallenge: (challenge: Challenge) => void;
    isCompleted: boolean;
}

const DailyTask: React.FC<DailyTaskProps> = ({ dailyTask, currentUser, onSelectChallenge, isCompleted }) => {
    
    const today = new Date().toISOString().split('T')[0];
    const hasCheckedInToday = currentUser.lastLoginDate === today;

    return (
        <div className="bg-surface/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-primary/20">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">Your Daily Update</h2>
                    <p className="text-text-secondary">Here's what's new for you today!</p>
                </div>
                <div className="flex items-center gap-4">
                    {hasCheckedInToday && (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 font-bold px-4 py-2 rounded-full">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Daily Check-in Complete!</span>
                        </div>
                    )}
                     <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/50 font-bold px-4 py-2 rounded-full">
                        <FireIcon />
                        <span>{currentUser.dailyStreak} Day Streak</span>
                    </div>
                </div>
            </div>

            <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl">
                <h3 className="font-bold text-lg text-primary mb-2 ml-1">🌟 Task of the Day</h3>
                <ChallengeCard
                    challenge={dailyTask}
                    onSelect={onSelectChallenge}
                    isCompleted={isCompleted}
                />
            </div>
        </div>
    );
};

export default DailyTask;
