import React from 'react';
import type { User } from '../types';
import { BADGES } from '../constants';
import { FireIcon } from './icons';

interface ProfileViewProps {
  currentUser: User;
  onUserUpdate: (user: User) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ currentUser }) => {

  const earnedBadges = BADGES.filter(badge => 
    (badge.type === 'points' && currentUser.points >= badge.threshold) ||
    (badge.type === 'streak' && currentUser.dailyStreak >= badge.threshold)
  );

  return (
    <>
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-surface p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center gap-6">
        <img src={currentUser.avatar} alt={currentUser.name} className="w-28 h-28 rounded-full border-4 border-primary shadow-md" />
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-text-primary">{currentUser.name}</h1>
          <p className="text-text-secondary">EcoChamp since {new Date().getFullYear()}</p>
          <div className="flex justify-center sm:justify-start items-center gap-6 mt-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary">{currentUser.points.toLocaleString()}</p>
              <p className="text-sm text-text-secondary">Eco-Points</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500 flex items-center gap-1"><FireIcon /> {currentUser.dailyStreak}</p>
              <p className="text-sm text-text-secondary">Day Streak</p>
            </div>
             <div className="text-center">
              <p className="text-2xl font-bold text-primary">{currentUser.completedChallenges.length}</p>
              <p className="text-sm text-text-secondary">Challenges Done</p>
            </div>
          </div>
        </div>
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
            Share My Progress
        </button>
      </div>

      {/* Badges */}
      <div className="bg-surface p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-text-primary mb-4">My Achievements</h2>
        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {earnedBadges.map(badge => (
              <div key={badge.name} className="bg-background p-4 rounded-lg text-center border border-yellow-200 dark:border-yellow-800">
                <div className="text-4xl text-yellow-500 mx-auto w-fit">{badge.icon}</div>
                <h3 className="font-bold text-text-primary mt-2">{badge.name}</h3>
                <p className="text-xs text-text-secondary">{badge.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text-secondary text-center py-4">Complete more challenges to earn badges!</p>
        )}
      </div>

      {/* Completed Challenges Gallery */}
      <div className="bg-surface p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-text-primary mb-4">My Challenge Proofs</h2>
        {currentUser.completedChallenges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentUser.completedChallenges.filter(c => c.proofUrl).map(challenge => (
              <div key={challenge.challengeId} className="relative group aspect-square">
                <img src={challenge.proofUrl} alt={challenge.challengeTitle} className="w-full h-full object-cover rounded-lg shadow-md" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-end p-2 rounded-lg">
                  <p className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">{challenge.challengeTitle}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
           <p className="text-text-secondary text-center py-4">Your completed challenge photos will appear here.</p>
        )}
      </div>
    </div>
    </>
  );
};

export default ProfileView;
