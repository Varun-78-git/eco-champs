
import React from 'react';
import type { User } from '../types';

interface LeaderboardProps {
  users: User[];
  currentUserId: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users, currentUserId }) => {
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);
  const podium = sortedUsers.slice(0, 3);
  const rest = sortedUsers.slice(3);

  const getPodiumClass = (index: number) => {
    switch (index) {
      case 0: return 'bg-yellow-400 border-yellow-500'; // Gold
      case 1: return 'bg-gray-300 border-gray-400'; // Silver
      case 2: return 'bg-yellow-600 border-yellow-700'; // Bronze
      default: return '';
    }
  };

  const getPodiumHeight = (index: number) => {
    switch (index) {
      case 0: return 'h-40';
      case 1: return 'h-32';
      case 2: return 'h-24';
      default: return '';
    }
  };
  
  const getPodiumOrder = (index: number) => {
    switch (index) {
        case 0: return 'order-2';
        case 1: return 'order-1';
        case 2: return 'order-3';
        default: return '';
    }
  }

  return (
    <div className="bg-surface p-6 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-center text-text-primary mb-2">Leaderboard</h2>
      <p className="text-center text-text-secondary mb-6">Top 5 champs qualify for the nationals!</p>
      
      {/* Podium */}
      <div className="flex justify-center items-end gap-4 mb-8">
        {podium.map((user, index) => (
          <div key={user.id} className={`flex flex-col items-center ${getPodiumOrder(index)}`}>
            <div className="relative">
                <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border-4 border-surface shadow-md mb-2" />
                <span className="absolute -top-2 -right-3 text-xs bg-yellow-300 dark:bg-yellow-400 text-yellow-900 font-bold px-2 py-1 rounded-full border-2 border-white dark:border-gray-800">🏆 Qualifier</span>
            </div>
            <div className={`w-24 text-center p-2 rounded-t-lg text-white font-bold ${getPodiumClass(index)} ${getPodiumHeight(index)} flex flex-col justify-end`}>
              <p className="text-sm truncate">{user.name}</p>
              <p className="text-lg font-extrabold">{user.points}</p>
            </div>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {rest.map((user, index) => {
           const rank = index + 4;
           const isQualifier = rank <= 5;
           return (
            <div
                key={user.id}
                className={`flex items-center p-3 rounded-lg transition-colors ${user.id === currentUserId ? 'bg-primary/20' : 'hover:bg-background'}`}
            >
                <span className="font-bold text-text-secondary w-8">{rank}</span>
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-4" />
                <span className="font-semibold text-text-primary flex-grow">{user.name}</span>
                {isQualifier && <span className="text-xs bg-yellow-200 dark:bg-yellow-400 text-yellow-800 dark:text-yellow-900 font-bold px-2 py-1 rounded-full mr-4">Qualifier</span>}
                <span className="font-bold text-primary">{user.points} pts</span>
            </div>
           )
        })}
      </div>
    </div>
  );
};

export default Leaderboard;