import React, { useState } from 'react';
import { XIcon } from './icons';

interface OnboardingModalProps {
  onClose: () => void;
}

const steps = [
  {
    emoji: '👋',
    title: 'Welcome to EcoChamps!',
    description: 'Get ready to become a champion for our planet by completing fun and impactful environmental challenges.',
  },
  {
    emoji: '🏆',
    title: 'Earn Eco-Points & Badges',
    description: 'For every challenge you complete, you\'ll earn Eco-Points. Collect points to climb the leaderboard and unlock cool badges for your achievements.',
  },
  {
    emoji: '🌿',
    title: 'Grow Our Digital School',
    description: 'As you and your friends earn points, you\'ll see our virtual school in the Community Hub become greener and more sustainable. Let\'s grow together!',
  },
  {
    emoji: '✨',
    title: 'Ready to Make a Difference?',
    description: 'Your journey starts now. Let\'s work together to create a better, cleaner world. Good luck, EcoChamp!',
  },
];

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md m-4 transform transition-all duration-300 scale-95 hover:scale-100 text-center p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
          <XIcon />
        </button>

        <div className="text-6xl mb-4">{step.emoji}</div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">{step.title}</h2>
        <p className="text-text-secondary mb-8">{step.description}</p>
        
        <div className="flex justify-center mb-4">
            {steps.map((_, index) => (
                <div key={index} className={`h-2 w-8 mx-1 rounded-full ${index === currentStep ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'}`}></div>
            ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors"
        >
          {currentStep < steps.length - 1 ? 'Next' : 'Get Started!'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingModal;
