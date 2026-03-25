import React, { useState } from 'react';
import type { Challenge, User, Badge, Announcement } from '../types';
import { INITIAL_CHALLENGES, BADGES } from '../constants';
import ChallengeCard from './ChallengeCard';
import ChallengeModal from './ChallengeModal';
import PersonalizedSuggestions from './PersonalizedSuggestions';
import DailyTask from './DailyTask';
import TeacherAnnouncement from './TeacherAnnouncement';
import EcoReminder from './EcoReminder';

interface DashboardProps {
  currentUser: User;
  dailyTask: Challenge;
  onCompleteChallenge: (challenge: Challenge, proofUrl: string) => void;
  announcements: Announcement[];
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, dailyTask, onCompleteChallenge, announcements }) => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const completedChallengeIds = currentUser.completedChallenges.map(c => c.challengeId);
  const earnedBadges = BADGES.filter(badge => 
      (badge.type === 'points' && currentUser.points >= badge.threshold) ||
      (badge.type === 'streak' && currentUser.dailyStreak >= badge.threshold)
  );

  return (
    <div className="space-y-8">
      <EcoReminder />
      {announcements.length > 0 && <TeacherAnnouncement announcement={announcements[0]} />}
      
      {/* User Welcome & Badges */}
      <div className="p-6 bg-surface/80 backdrop-blur-md rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-text-primary">Welcome back, {currentUser.name}!</h1>
        <p className="text-text-secondary mt-1">Ready to make a difference today?</p>
        
        {earnedBadges.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-text-secondary mb-2">Your Badges</h3>
            <div className="flex flex-wrap gap-4">
              {earnedBadges.map(badge => (
                <div key={badge.name} className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 p-2 rounded-lg" title={badge.description}>
                  {badge.icon}
                  <span className="font-bold text-sm">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Daily Task */}
      <DailyTask 
        dailyTask={dailyTask} 
        currentUser={currentUser} 
        onSelectChallenge={setSelectedChallenge}
        isCompleted={completedChallengeIds.includes(dailyTask.id)}
      />

      {/* Personalized Suggestions */}
      <PersonalizedSuggestions onChallengeSelect={setSelectedChallenge} completedChallengeIds={completedChallengeIds} />

      {/* Standard Challenges */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-4">More Eco-Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_CHALLENGES.map(challenge => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onSelect={setSelectedChallenge}
              isCompleted={completedChallengeIds.includes(challenge.id)}
            />
          ))}
        </div>
      </div>

      {selectedChallenge && (
        <ChallengeModal
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          onComplete={(challenge, proofUrl) => {
            onCompleteChallenge(challenge, proofUrl);
            setSelectedChallenge(null);
          }}
          isCompleted={completedChallengeIds.includes(selectedChallenge.id)}
        />
      )}
    </div>
  );
};

export default Dashboard;
