
import React, { useState, useEffect, useCallback } from 'react';

interface WasteItem {
    id: string;
    type: 'wet' | 'dry' | 'recyclable';
    content: string; // emoji
}

const initialItems: WasteItem[] = [
    { id: 'banana', type: 'wet', content: '🍌' },
    { id: 'bottle', type: 'recyclable', content: '🍾' },
    { id: 'paper', type: 'dry', content: '📰' },
    { id: 'can', type: 'recyclable', content: '🥫' },
    { id: 'apple', type: 'wet', content: '🍎' },
    { id: 'chips', type: 'dry', content: '🥨' },
];

// fix: Use "as const" to ensure TypeScript infers the literal types for bin.type,
// resolving the type mismatch with the `handleDrop` function's parameter.
const bins = [
    { type: 'wet', label: 'Wet Waste', color: 'bg-green-500' },
    { type: 'dry', label: 'Dry Waste', color: 'bg-blue-500' },
    { type: 'recyclable', label: 'Recyclable', color: 'bg-yellow-500' },
] as const;

const WasteSortingGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [items, setItems] = useState<WasteItem[]>([]);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<{ message: string; type: 'correct' | 'incorrect' } | null>(null);
    const [draggedItem, setDraggedItem] = useState<WasteItem | null>(null);

    const playSound = (type: 'correct' | 'incorrect') => {
        // In a real app, you'd have actual sound files.
        // new Audio(type === 'correct' ? '/sounds/correct.mp3' : '/sounds/incorrect.mp3').play();
    };

    const showFeedback = (message: string, type: 'correct' | 'incorrect') => {
        setFeedback({ message, type });
        setTimeout(() => setFeedback(null), 1500);
    };
    
    const shuffleItems = useCallback(() => {
        setItems([...initialItems].sort(() => Math.random() - 0.5));
        setScore(0);
    }, []);

    useEffect(() => {
        shuffleItems();
    }, [shuffleItems]);

    const handleDragStart = (item: WasteItem) => {
        setDraggedItem(item);
    };

    const handleDrop = (binType: 'wet' | 'dry' | 'recyclable') => {
        if (!draggedItem) return;

        if (draggedItem.type === binType) {
            setItems(prev => prev.filter(i => i.id !== draggedItem.id));
            setScore(prev => prev + 10);
            showFeedback('Correct!', 'correct');
            playSound('correct');
        } else {
            showFeedback('Try Again!', 'incorrect');
            playSound('incorrect');
        }
        setDraggedItem(null);
    };
    
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    if (items.length === 0 && initialItems.length > 0) {
        return (
            <div className="text-center p-8">
                <h2 className="text-3xl font-bold text-primary mb-4">Great Job!</h2>
                <p className="text-text-secondary text-lg mb-4">You've sorted all the items and scored {score} points!</p>
                <div className="text-6xl mb-6">🎉</div>
                <button onClick={shuffleItems} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors mr-4">
                    Play Again
                </button>
                <button onClick={onBack} className="bg-gray-200 dark:bg-gray-600 text-text-primary font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                    Back to Games
                </button>
            </div>
        );
    }
    

    return (
        <div className="flex flex-col items-center p-4">
            <h2 className="text-2xl font-bold text-text-primary mb-2">Waste Sorting Challenge</h2>
            <p className="text-text-secondary mb-4">Drag each item to the correct bin.</p>
            <p className="text-xl font-bold text-secondary mb-6">Score: {score}</p>
            
            {feedback && (
                <div className={`absolute top-1/2 -translate-y-1/2 text-2xl font-bold p-4 rounded-lg shadow-lg ${feedback.type === 'correct' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {feedback.message}
                </div>
            )}
            
            {/* Items to Sort */}
            <div className="h-24 bg-gray-100 dark:bg-gray-700 w-full flex justify-center items-center gap-4 p-4 rounded-lg mb-8">
                {items.map(item => (
                    <div
                        key={item.id}
                        draggable
                        onDragStart={() => handleDragStart(item)}
                        className="text-5xl cursor-grab transition-transform transform hover:scale-110 active:cursor-grabbing"
                    >
                        {item.content}
                    </div>
                ))}
            </div>

            {/* Bins */}
            <div className="w-full grid grid-cols-3 gap-4 text-center">
                {bins.map(bin => (
                    <div
                        key={bin.type}
                        onDrop={() => handleDrop(bin.type)}
                        onDragOver={handleDragOver}
                        className={`p-8 border-4 border-dashed rounded-xl transition-colors ${draggedItem ? 'border-gray-400 dark:border-gray-500' : 'border-gray-300 dark:border-gray-600'}`}
                    >
                        <div className={`w-16 h-16 mx-auto rounded-lg ${bin.color} mb-2`}></div>
                        <p className="font-bold text-text-primary">{bin.label}</p>
                    </div>
                ))}
            </div>
            <button onClick={onBack} className="mt-8 bg-gray-200 dark:bg-gray-600 text-text-primary font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                Back to Games
            </button>
        </div>
    );
};

export default WasteSortingGame;