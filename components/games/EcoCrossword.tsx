
import React, { useState, useRef, useEffect } from 'react';

const crosswordData = {
  grid: [
    ['R', 'E', 'C', 'Y', 'C', 'L', 'E', null, null, null],
    [null, null, null, null, null, 'A', null, null, null, null],
    ['W', 'A', 'T', 'E', 'R', 'T', null, null, null, null],
    [null, null, null, null, null, 'H', null, null, null, null],
    [null, 'S', 'O', 'L', 'A', 'R', null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, 'F', 'O', 'R', 'E', 'S', 'T', null, null],
    [null, null, null, null, null, null, null, null, null, null],
  ],
  clues: {
    across: [
      { num: 1, clue: 'Convert waste into reusable material.', row: 0, col: 0, answer: 'RECYCLE' },
      { num: 2, clue: 'A colorless, transparent, odorless liquid.', row: 2, col: 0, answer: 'WATER' },
      { num: 4, clue: 'Energy from the sun.', row: 4, col: 1, answer: 'SOLAR' },
      { num: 5, clue: 'A large area covered chiefly with trees.', row: 6, col: 2, answer: 'FOREST' },
    ],
    down: [
      { num: 3, clue: 'The planet on which we live.', row: 0, col: 5, answer: 'EARTH' },
    ],
  },
};

const EcoCrossword: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [grid, setGrid] = useState<Array<Array<string | null>>>(() =>
    Array(crosswordData.grid.length).fill(null).map(() => Array(crosswordData.grid[0].length).fill(null))
  );
  const [isComplete, setIsComplete] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, row: number, col: number) => {
    const { value } = e.target;
    const newGrid = [...grid];
    newGrid[row][col] = value.toUpperCase();
    setGrid(newGrid);

    // Auto-focus next input
    if (value && col + 1 < crosswordData.grid[0].length && crosswordData.grid[row][col + 1]) {
        const nextInput = inputRefs.current[row * crosswordData.grid[0].length + col + 1];
        nextInput?.focus();
    }
  };
  
  const checkAnswers = () => {
    let isCorrect = true;
    for (let r = 0; r < crosswordData.grid.length; r++) {
      for (let c = 0; c < crosswordData.grid[0].length; c++) {
        if (crosswordData.grid[r][c] && crosswordData.grid[r][c] !== (grid[r][c] || '').toUpperCase()) {
          isCorrect = false;
          break;
        }
      }
      if (!isCorrect) break;
    }
    if(isCorrect) {
        setIsComplete(true);
    } else {
        alert("Not quite! Keep trying.");
    }
  };
  
  const resetGame = () => {
    setGrid(Array(crosswordData.grid.length).fill(null).map(() => Array(crosswordData.grid[0].length).fill(null)));
    setIsComplete(false);
  }

  if (isComplete) {
     return (
        <div className="text-center p-8">
            <h2 className="text-3xl font-bold text-primary mb-4">You solved it!</h2>
            <p className="text-text-secondary text-lg mb-4">You are a true Eco-Whiz!</p>
            <div className="text-6xl mb-6">🧠💡</div>
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
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center text-text-primary mb-4">Eco Crossword</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
            <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${crosswordData.grid[0].length}, minmax(0, 1fr))` }}>
            {crosswordData.grid.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                const cellIndex = rIdx * crosswordData.grid[0].length + cIdx;
                if (!cell) {
                  return <div key={`${rIdx}-${cIdx}`} className="w-8 h-8 md:w-10 md:h-10 bg-transparent"></div>;
                }
                const clueNumber = [...crosswordData.clues.across, ...crosswordData.clues.down].find(c => c.row === rIdx && c.col === cIdx)?.num;
                return (
                  <div key={`${rIdx}-${cIdx}`} className="relative w-8 h-8 md:w-10 md:h-10">
                    {clueNumber && <span className="absolute top-0 left-0.5 text-xs text-text-secondary font-semibold">{clueNumber}</span>}
                    <input
                      // fix: Use a block body for the ref callback to avoid returning a value, which fixes the TypeScript error.
                      ref={el => { inputRefs.current[cellIndex] = el; }}
                      type="text"
                      maxLength={1}
                      value={grid[rIdx][cIdx] || ''}
                      onChange={(e) => handleChange(e, rIdx, cIdx)}
                      className="w-full h-full text-center font-bold text-lg bg-background text-text-primary border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold text-lg text-primary mb-2">Across</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  {crosswordData.clues.across.map(c => <li key={c.num}><strong className="text-text-primary">{c.num}.</strong> {c.clue}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg text-primary mb-2">Down</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  {crosswordData.clues.down.map(c => <li key={c.num}><strong className="text-text-primary">{c.num}.</strong> {c.clue}</li>)}
                </ul>
              </div>
          </div>
        </div>
      </div>
       <div className="text-center mt-8">
            <button onClick={checkAnswers} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors mr-4">
                Check Answers
            </button>
            <button onClick={onBack} className="bg-gray-200 dark:bg-gray-600 text-text-primary font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                Back to Games
            </button>
        </div>
    </div>
  );
};

export default EcoCrossword;