import React, { useState, useEffect } from 'react';

const GRID_SIZE = 3;
// Change PUZZLE_SIZE to be divisible by GRID_SIZE to avoid floating point issues.
const PUZZLE_SIZE = 390; 
const IMAGE_URL = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop';
const FUN_FACT = 'Forests are home to over 80% of all terrestrial species of animals, plants, and insects!';

interface Piece {
    id: number;
    correctX: number;
    correctY: number;
    currentX: number;
    currentY: number;
}

const EcoJigsawPuzzle: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [pieces, setPieces] = useState<Piece[]>([]);
    const [draggedPieceId, setDraggedPieceId] = useState<number | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [isWrongOrder, setIsWrongOrder] = useState(false);

    const pieceSize = PUZZLE_SIZE / GRID_SIZE;

    const initializeAndShuffle = () => {
        const initialPieces: Piece[] = [];
        for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
            const row = Math.floor(i / GRID_SIZE);
            const col = i % GRID_SIZE;
            initialPieces.push({
                id: i,
                correctX: col * pieceSize,
                correctY: row * pieceSize,
                // Place pieces in a "pool" to the right of the board
                currentX: PUZZLE_SIZE + 50 + Math.random() * 100,
                currentY: Math.random() * (PUZZLE_SIZE - pieceSize),
            });
        }
        setPieces(initialPieces.sort(() => Math.random() - 0.5)); // Shuffle the render order
        setIsComplete(false);
        setIsWrongOrder(false);
    };

    useEffect(() => {
        initializeAndShuffle();
    }, []);
    
    const checkBoardState = (updatedPieces: Piece[]) => {
        const allOnBoard = updatedPieces.every(p => 
            p.currentX >= 0 && p.currentX < PUZZLE_SIZE &&
            p.currentY >= 0 && p.currentY < PUZZLE_SIZE
        );
    
        if (allOnBoard) {
            const allInPlace = updatedPieces.every(p => p.currentX === p.correctX && p.currentY === p.correctY);
            if (allInPlace) {
                setIsComplete(true);
                setIsWrongOrder(false);
            } else {
                setIsWrongOrder(true);
                setTimeout(() => setIsWrongOrder(false), 2000);
            }
        } else {
            setIsWrongOrder(false);
        }
    };
    

    const handleDragStart = (e: React.DragEvent, id: number) => {
        setDraggedPieceId(id);
        const img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        e.dataTransfer.setDragImage(img, 0, 0);
    };

    const handleBoardDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (draggedPieceId === null) return;

        const boardRect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - boardRect.left;
        const y = e.clientY - boardRect.top;

        const col = Math.floor(x / pieceSize);
        const row = Math.floor(y / pieceSize);

        const newX = col * pieceSize;
        const newY = row * pieceSize;

        const isOccupied = pieces.some(p => p.currentX === newX && p.currentY === newY);
        
        if (!isOccupied) {
            const updatedPieces = pieces.map(p =>
                p.id === draggedPieceId ? { ...p, currentX: newX, currentY: newY } : p
            );
            setPieces(updatedPieces);
            checkBoardState(updatedPieces);
        }
        setDraggedPieceId(null);
    };

    const handlePieceDrop = (e: React.DragEvent, targetPieceId: number) => {
        e.preventDefault();
        e.stopPropagation();
        if (draggedPieceId === null || draggedPieceId === targetPieceId) {
            setDraggedPieceId(null);
            return;
        }

        const draggedPiece = pieces.find(p => p.id === draggedPieceId);
        const targetPiece = pieces.find(p => p.id === targetPieceId);

        if (!draggedPiece || !targetPiece) return;
        
        const updatedPieces = pieces.map(p => {
            if (p.id === draggedPieceId) {
                return { ...p, currentX: targetPiece.currentX, currentY: targetPiece.currentY };
            }
            if (p.id === targetPieceId) {
                return { ...p, currentX: draggedPiece.currentX, currentY: draggedPiece.currentY };
            }
            return p;
        });

        setPieces(updatedPieces);
        checkBoardState(updatedPieces);
        setDraggedPieceId(null);
    };
    
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };
    
    const handleDragEnd = () => {
        setDraggedPieceId(null);
    };

    return (
        <div className="flex flex-col items-center p-4 relative">
             <style>{`
                @keyframes balloon-rise {
                  from {
                    transform: translateY(100px);
                    opacity: 1;
                  }
                  to {
                    transform: translateY(-100vh);
                    opacity: 0;
                  }
                }
                .balloon {
                  position: absolute;
                  bottom: -100px;
                  will-change: transform;
                  animation-name: balloon-rise;
                  animation-timing-function: linear;
                }
            `}</style>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Eco Jigsaw Puzzle</h2>
            <p className="text-text-secondary mb-4">Complete the puzzle to learn a fun fact!</p>
            
             <div className="flex justify-center items-start">
                 <div
                    className="relative"
                    style={{
                        width: PUZZLE_SIZE + 250, 
                        height: PUZZLE_SIZE,
                    }}
                >
                    {/* The Board */}
                    <div
                        className="absolute top-0 left-0 bg-gray-200 dark:bg-gray-700 grid"
                        style={{
                            width: PUZZLE_SIZE,
                            height: PUZZLE_SIZE,
                            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                        }}
                        onDrop={handleBoardDrop}
                        onDragOver={handleDragOver}
                    >
                        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
                             <div key={i} className="border border-gray-400/50"></div>
                        ))}
                    </div>

                    {isWrongOrder && (
                        <div 
                            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white font-bold p-4 rounded-lg shadow-lg z-20"
                            style={{ left: `${PUZZLE_SIZE / 2}px` }}
                        >
                            Incorrect Order! Keep trying.
                        </div>
                    )}

                    {pieces.map(piece => (
                        <div
                            key={piece.id}
                            draggable
                            onDragStart={e => handleDragStart(e, piece.id)}
                            onDragEnd={handleDragEnd}
                            onDrop={e => handlePieceDrop(e, piece.id)}
                            onDragOver={handleDragOver}
                            className={`absolute cursor-grab transition-all duration-300 ${draggedPieceId === piece.id ? 'opacity-50' : ''}`}
                            style={{
                                width: pieceSize,
                                height: pieceSize,
                                backgroundImage: `url(${IMAGE_URL})`,
                                backgroundSize: `${PUZZLE_SIZE}px ${PUZZLE_SIZE}px`,
                                backgroundPosition: `-${piece.correctX}px -${piece.correctY}px`,
                                transform: `translate(${piece.currentX}px, ${piece.currentY}px)`,
                                left: 0,
                                top: 0,
                                zIndex: draggedPieceId === piece.id ? 10 : 1,
                            }}
                        />
                    ))}
                </div>
            </div>

            {isComplete && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center text-white p-4 rounded-2xl z-30 overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        {Array.from({ length: 15 }).map((_, i) => {
                            const colors = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'];
                            const size = 20 + Math.random() * 20;
                            return (
                                <div
                                    key={i}
                                    className="balloon"
                                    style={{
                                        left: `${5 + Math.random() * 90}%`,
                                        animationDuration: `${5 + Math.random() * 5}s`,
                                        animationDelay: `${Math.random() * 2}s`,
                                        width: `${size}px`,
                                        height: `${size * 1.25}px`,
                                        borderRadius: '50%',
                                        backgroundColor: colors[i % colors.length],
                                        opacity: 0.7,
                                    }}
                                />
                            );
                        })}
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-4xl font-bold text-green-400 mb-2">Congratulations!</h3>
                        <p className="text-2xl mb-4">The order is correct!</p>
                        <div className="text-6xl mb-4">🎉</div>
                        <p className="text-lg font-semibold mb-2">Fun Fact:</p>
                        <p className="max-w-md">{FUN_FACT}</p>
                        <div className="mt-8">
                            <button onClick={initializeAndShuffle} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors mr-4">
                                Play Again
                            </button>
                            <button onClick={onBack} className="bg-gray-200 text-black font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors">
                                Back to Games
                            </button>
                        </div>
                    </div>
                 </div>
            )}
             <button onClick={onBack} className="mt-8 bg-gray-200 dark:bg-gray-600 text-text-primary font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                Back to Games
            </button>
        </div>
    );
};

export default EcoJigsawPuzzle;
