import React, { useState } from 'react';
import WasteSortingGame from './games/WasteSortingGame';
import SaveTheHabitatGame from './games/SaveTheHabitatGame';
import EcoJigsawPuzzle from './games/EcoJigsawPuzzle';
import EcoCrossword from './games/EcoCrossword';
import WaterSaverGame from './games/WaterSaverGame';

type GameType = 'sorting' | 'habitat' | 'jigsaw' | 'crossword' | 'water_saver' | null;

const GameCard: React.FC<{
    emoji: string;
    title: string;
    description: string;
    onClick: () => void;
}> = ({ emoji, title, description, onClick }) => (
    <div
        onClick={onClick}
        className="bg-surface rounded-2xl shadow-lg p-8 text-center cursor-pointer transform hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center"
    >
        <div className="text-7xl mb-4">{emoji}</div>
        <h3 className="text-2xl font-bold text-primary mb-2">{title}</h3>
        <p className="text-text-secondary">{description}</p>
    </div>
);

const FunGames: React.FC = () => {
    const [activeGame, setActiveGame] = useState<GameType>(null);

    const renderActiveGame = () => {
        switch (activeGame) {
            case 'sorting':
                return <WasteSortingGame onBack={() => setActiveGame(null)} />;
            case 'habitat':
                return <SaveTheHabitatGame onBack={() => setActiveGame(null)} />;
            case 'jigsaw':
                return <EcoJigsawPuzzle onBack={() => setActiveGame(null)} />;
            case 'crossword':
                return <EcoCrossword onBack={() => setActiveGame(null)} />;
            case 'water_saver':
                return <WaterSaverGame onBack={() => setActiveGame(null)} />;
            default:
                return null;
        }
    };

    if (activeGame) {
        return (
            <div className="bg-surface p-4 sm:p-8 rounded-2xl shadow-xl max-w-4xl mx-auto">
                {renderActiveGame()}
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-text-primary">Eco Fun Zone</h2>
                <p className="text-lg text-text-secondary mt-2">
                    Learn about sustainability while playing these fun mini-games!
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <GameCard
                    emoji="🗑️"
                    title="Waste Sorting"
                    description="Drag and drop the items into the correct waste bins."
                    onClick={() => setActiveGame('sorting')}
                />
                <GameCard
                    emoji="🐢"
                    title="Save the Habitat"
                    description="Match the animals to their correct homes."
                    onClick={() => setActiveGame('habitat')}
                />
                <GameCard
                    emoji="🧩"
                    title="Eco Jigsaw"
                    description="Complete the puzzle to reveal a beautiful ecosystem."
                    onClick={() => setActiveGame('jigsaw')}
                />
                 <GameCard
                    emoji="✍️"
                    title="Eco Crossword"
                    description="Solve the clues to fill in this environmental crossword."
                    onClick={() => setActiveGame('crossword')}
                />
                 <GameCard
                    emoji="💧"
                    title="Water Saver"
                    description="Make choices to save water in our interactive simulator."
                    onClick={() => setActiveGame('water_saver')}
                />
            </div>
        </div>
    );
};

export default FunGames;