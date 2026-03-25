import React, { useState, useEffect, useMemo } from 'react';

interface Animal { name: string; emoji: string; }
interface Habitat { name: string; emoji: string; }

const gameData: { animal: Animal; habitat: Habitat }[] = [
    { animal: { name: 'Fish', emoji: '🐟' }, habitat: { name: 'Water', emoji: '💧' } },
    { animal: { name: 'Tiger', emoji: '🐅' }, habitat: { name: 'Forest', emoji: '🌳' } },
    { animal: { name: 'Camel', emoji: '🐪' }, habitat: { name: 'Desert', emoji: '🌵' } },
    { animal: { name: 'Polar Bear', emoji: '🐻‍❄️' }, habitat: { name: 'Arctic', emoji: '🧊' } },
];

const SaveTheHabitatGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [habitats, setHabitats] = useState<Habitat[]>([]);
    const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
    const [incorrectMatch, setIncorrectMatch] = useState<string[]>([]);
    const [score, setScore] = useState(0);

    const shuffle = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

    const resetGame = () => {
        setAnimals(shuffle(gameData.map(d => d.animal)));
        setHabitats(shuffle(gameData.map(d => d.habitat)));
        setSelectedAnimal(null);
        setMatchedPairs([]);
        setScore(0);
    };

    useEffect(() => {
        resetGame();
    }, []);
    
    const handleAnimalSelect = (animal: Animal) => {
        if (matchedPairs.includes(animal.name)) return;
        setSelectedAnimal(animal);
    };

    const handleHabitatSelect = (habitat: Habitat) => {
        if (!selectedAnimal || matchedPairs.includes(selectedAnimal.name)) return;

        const correctHabitat = gameData.find(d => d.animal.name === selectedAnimal.name)?.habitat;

        if (correctHabitat?.name === habitat.name) {
            setMatchedPairs(prev => [...prev, selectedAnimal.name]);
            setScore(prev => prev + 25);
            setSelectedAnimal(null);
        } else {
            setIncorrectMatch([selectedAnimal.name, habitat.name]);
            setTimeout(() => {
                setIncorrectMatch([]);
                setSelectedAnimal(null);
            }, 800);
        }
    };
    
    const isGameWon = matchedPairs.length === gameData.length;

    if (isGameWon) {
         return (
            <div className="text-center p-8">
                <h2 className="text-3xl font-bold text-primary mb-4">Habitats Saved!</h2>
                <p className="text-text-secondary text-lg mb-4">Amazing work! You scored {score} eco-points!</p>
                <div className="text-6xl mb-6">🥳</div>
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
        <div className="flex flex-col items-center p-4">
            <h2 className="text-2xl font-bold text-text-primary mb-2">Save the Habitat</h2>
            <p className="text-text-secondary mb-4">Match each animal to its correct home.</p>
            <p className="text-xl font-bold text-secondary mb-6">Score: {score}</p>
            
            <div className="w-full grid grid-cols-2 gap-8">
                {/* Animals */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-center">Animals</h3>
                    {animals.map(animal => {
                        const isMatched = matchedPairs.includes(animal.name);
                        const isSelected = selectedAnimal?.name === animal.name;
                        const isIncorrect = incorrectMatch.includes(animal.name);
                        return (
                            <button
                                key={animal.name}
                                onClick={() => handleAnimalSelect(animal)}
                                className={`w-full p-4 rounded-lg flex items-center justify-center gap-4 text-xl font-semibold transition-all duration-200 ${
                                    isMatched ? 'bg-green-500 text-white opacity-50' :
                                    isIncorrect ? 'bg-red-500 text-white animate-shake' :
                                    isSelected ? 'bg-primary text-white ring-4 ring-primary-dark' :
                                    'bg-background hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                            >
                                <span>{animal.emoji}</span> {animal.name}
                            </button>
                        )
                    })}
                </div>
                 {/* Habitats */}
                <div className="space-y-4">
                     <h3 className="text-lg font-bold text-center">Habitats</h3>
                    {habitats.map(habitat => {
                         const correctAnimal = gameData.find(d => d.habitat.name === habitat.name)?.animal;
                         const isMatched = matchedPairs.includes(correctAnimal?.name || '');
                         const isIncorrect = incorrectMatch.includes(habitat.name);
                        return (
                            <button
                                key={habitat.name}
                                onClick={() => handleHabitatSelect(habitat)}
                                disabled={!selectedAnimal || isMatched}
                                className={`w-full p-4 rounded-lg flex items-center justify-center gap-4 text-xl font-semibold transition-all duration-200 ${
                                    isMatched ? 'bg-green-500 text-white opacity-50' :
                                    isIncorrect ? 'bg-red-500 text-white animate-shake' :
                                    !selectedAnimal ? 'bg-background cursor-not-allowed' :
                                    'bg-background hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                            >
                                <span>{habitat.emoji}</span> {habitat.name}
                            </button>
                        )
                    })}
                </div>
            </div>
             <button onClick={onBack} className="mt-8 bg-gray-200 dark:bg-gray-600 text-text-primary font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                Back to Games
            </button>
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .animate-shake { animation: shake 0.5s ease-in-out; }
            `}</style>
        </div>
    );
};

export default SaveTheHabitatGame;