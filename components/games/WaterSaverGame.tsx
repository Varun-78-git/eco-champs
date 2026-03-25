import React, { useState } from 'react';

const tasks = [
    {
        title: 'Brushing Your Teeth',
        scenario: 'You are brushing your teeth. What do you do with the tap?',
        options: [
            { text: 'Leave it running', water: -5, points: 0 },
            { text: 'Turn it off', water: 0, points: 10 },
        ],
        emoji: '🦷'
    },
    {
        title: 'Watering the Garden',
        scenario: 'Your plants are thirsty! How do you water them?',
        options: [
            { text: 'Use a hosepipe', water: -20, points: 0 },
            { text: 'Use a watering can', water: -5, points: 15 },
        ],
        emoji: '🌱'
    },
    {
        title: 'Leaky Faucet',
        scenario: 'You notice a tap is dripping slowly in the bathroom.',
        options: [
            { text: 'Tell an adult to fix it', water: 0, points: 25 },
            { text: 'Ignore it', water: -30, points: 0 },
        ],
        emoji: '💧'
    },
    {
        title: 'Washing Vegetables',
        scenario: 'You need to wash some vegetables for a salad.',
        options: [
            { text: 'Wash them in a bowl', water: -2, points: 10 },
            { text: 'Wash under a running tap', water: -10, points: 0 },
        ],
        emoji: '🥕'
    }
];

const MAX_WATER = 100;

const WaterSaverGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [water, setWater] = useState(MAX_WATER);
    const [score, setScore] = useState(0);
    const [taskIndex, setTaskIndex] = useState(0);
    const [feedback, setFeedback] = useState('');

    const currentTask = tasks[taskIndex];
    const isGameOver = taskIndex >= tasks.length || water <= 0;
    
    const handleOptionClick = (option: { water: number, points: number }) => {
        const newWater = Math.max(0, water + option.water);
        const newScore = score + option.points;
        
        let fb = '';
        if(option.points > 0) {
            fb = `Great choice! You saved water and earned ${option.points} points.`;
        } else if(option.water < 0) {
            fb = `Oh no! That wasted ${-option.water}L of water.`;
        }
        setFeedback(fb);

        setWater(newWater);
        setScore(newScore);
        
        setTimeout(() => {
            setTaskIndex(taskIndex + 1);
            setFeedback('');
        }, 2000);
    };
    
    const resetGame = () => {
        setWater(MAX_WATER);
        setScore(0);
        setTaskIndex(0);
        setFeedback('');
    };

    if (isGameOver) {
         return (
            <div className="text-center p-8">
                <h2 className="text-3xl font-bold text-primary mb-4">{water > 0 ? "You're a Water Hero!" : "Out of Water!"}</h2>
                <p className="text-text-secondary text-lg mb-4">You finished with a score of {score} and {water}L of water left.</p>
                <div className="text-6xl mb-6">{water > 0 ? '🏆' : '💔'}</div>
                <button onClick={resetGame} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors mr-4">
                    Play Again
                </button>
                 <button onClick={onBack} className="bg-gray-200 dark:bg-gray-600 text-text-primary font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                    Back to Games
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Water Saver Challenge</h2>
            
            {/* Water Tank */}
            <div className="w-full max-w-sm mb-4">
                <div className="flex justify-between font-bold text-sm">
                    <span className="text-text-secondary">Reservoir</span>
                    <span className="text-primary">{water}L / {MAX_WATER}L</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 mt-1 overflow-hidden">
                    <div className="bg-blue-500 h-6 rounded-full transition-all duration-500" style={{ width: `${(water / MAX_WATER) * 100}%` }}></div>
                </div>
            </div>
             <p className="text-xl font-bold text-secondary mb-6">Score: {score}</p>
            
            {/* Task Card */}
            <div className="w-full max-w-md bg-background p-6 rounded-xl shadow-md text-center">
                <div className="text-5xl mb-3">{currentTask.emoji}</div>
                <h3 className="text-xl font-bold text-text-primary">{currentTask.title}</h3>
                <p className="text-text-secondary my-4">{currentTask.scenario}</p>
                
                 {feedback ? (
                    <p className="h-12 font-semibold text-primary">{feedback}</p>
                ) : (
                    <div className="grid grid-cols-2 gap-4 h-12">
                        {currentTask.options.map((opt, idx) => (
                            <button key={idx} onClick={() => handleOptionClick(opt)} className="bg-surface hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-lg font-semibold transition-colors">
                                {opt.text}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <button onClick={onBack} className="mt-8 bg-gray-200 dark:bg-gray-600 text-text-primary font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                Back to Games
            </button>
        </div>
    );
};

export default WaterSaverGame;