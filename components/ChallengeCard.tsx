import React from 'react';
import type { Challenge } from '../types';

interface ChallengeCardProps {
  challenge: Challenge;
  onSelect: (challenge: Challenge) => void;
  isCompleted: boolean;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onSelect, isCompleted }) => {
  
  const difficultyColor = {
    Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <div 
      onClick={() => onSelect(challenge)}
      className={`bg-surface rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1 flex flex-col ${isCompleted ? 'opacity-60' : ''}`}
    >
      <div className="p-5 flex-grow">
        <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
                <div className="bg-primary text-white p-3 rounded-lg">
                    {challenge.icon}
                </div>
                <div>
                    <h3 className="font-bold text-lg text-text-primary">{challenge.title}</h3>
                    <p className="text-sm text-text-secondary">{challenge.category}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-bold text-secondary text-lg">{challenge.points}</p>
                <p className="text-xs text-text-secondary">Points</p>
            </div>
        </div>
        <p className="text-text-secondary mt-3 text-sm line-clamp-2">{challenge.description}</p>
      </div>
      
      <div className="px-5 pb-4 mt-auto flex justify-between items-center">
        {challenge.difficulty && (
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${difficultyColor[challenge.difficulty]}`}>
                {challenge.difficulty}
            </span>
        )}
        {isCompleted && (
            <div className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-xs font-semibold px-3 py-1 rounded-full flex items-center ml-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                COMPLETED
            </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeCard;
