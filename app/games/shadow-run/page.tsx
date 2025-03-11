'use client';
import { useState, useEffect, useCallback } from 'react';

// Game constants
const GRID_SIZE = 15;
const CELL_SIZE = 40;

// Example walls -> will be randomly created in the final game
const WALLS = [
    // Outer walls
    {x: 0, y: 0, w: GRID_SIZE, h: 1}, // Top
    {x: 0, y: GRID_SIZE-1, w: GRID_SIZE, h: 1}, // Bottom
    {x: 0, y: 0, w: 1, h: GRID_SIZE}, // Left
    {x: GRID_SIZE-1, y: 0, w: 1, h: GRID_SIZE}, // Right

    // Inner vertical walls
    {x: 2, y: 2, w: 1, h: 6},
    {x: 4, y: 4, w: 1, h: 5},
    {x: 6, y: 2, w: 1, h: 3},
    {x: 9, y: 1, w: 1, h: 8},
    {x: 3, y: 1, w: 1, h: 1},
    {x: 6, y: 6, w: 1, h: 7},
    {x: 11, y: 8, w: 1, h: 5},
    {x: 11, y: 2, w: 1, h: 5},
    {x: 13, y: 1, w: 1, h: 5},
    {x: 2, y: 9, w: 1, h: 5},
    {x: 4, y: 12, w: 1, h: 2},
    {x: 8, y: 4, w: 1, h: 4},
    {x: 7, y: 9, w: 1, h: 2},
    {x: 9, y: 12, w: 1, h: 2},
    {x: 8, y: 12, w: 1, h: 1},
    {x: 12, y: 11, w: 1, h: 2},
    {x: 13, y: 9, w: 1, h: 1},
    {x: 13, y: 7, w: 1, h: 1},


    // Inner horizontal walls
    {x: 2, y: 2, w: 6, h: 1},
    {x: 3, y: 5, w: 2, h: 1},
    {x: 4, y: 7, w: 3, h: 1},
    {x: 8, y: 10, w: 4, h: 1},
    {x: 2, y: 10, w: 3, h: 1},
    {x: 12, y: 6, w: 2, h: 1},
    {x: 2, y: 10, w: 3, h: 1},
    {x: 2, y: 10, w: 3, h: 1},
    
];

//Add this helper function after the WALLS constant
const getRandomPosition = () => {
    let newPos;
    do {
        newPos = {
            x: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1,
            y: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1
        };
    } while (isColliding(newPos));
    return newPos;
};

// Player initial position
const INITIAL_PLAYER = { x: 1, y: 1 };


const isColliding = (playerPos: {x: number, y: number}) => {
    return WALLS.some(wall => {
        return playerPos.x >= wall.x && 
               playerPos.x < wall.x + wall.w && 
               playerPos.y >= wall.y && 
               playerPos.y < wall.y + wall.h;
    });
};

const ShadowRunPage = () => {
    const [player, setPlayer] = useState(INITIAL_PLAYER);
    const [mysteryPoint, setMysteryPoint] = useState({ x: 13, y: 13 });
    const [spellPower, setSpellPower] = useState(0);
    const [score, setScore] = useState(0);
    const [showInstructions, setShowInstructions] = useState(true);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isGameOver, setIsGameOver] = useState(false);
    const [pointsCollected, setPointsCollected] = useState(0);

    // Update isMysteryPoint to use the mysteryPoint state
    const isMysteryPoint = useCallback((playerPos: {x: number, y: number}) => {
        return playerPos.x === mysteryPoint.x && playerPos.y === mysteryPoint.y;
    }, [mysteryPoint]);

    // Modify handleMysteryPoint to update mystery point position
    const handleMysteryPoint = useCallback((newPos: {x: number, y: number}) => {
        if (isMysteryPoint(newPos)) {
            setScore(prev => prev + 100);
            setPointsCollected(prev => prev + 1);
            setMysteryPoint(getRandomPosition());
        }
    }, [isMysteryPoint]);

    // Modify the handleMovement function
    const handleMovement = useCallback((e: KeyboardEvent) => {
        const key = e.key.toLowerCase();
        setPlayer(prev => {
            const newPos = { ...prev };
            switch (key) {
                case 'arrowup':
                case 'w':
                    newPos.y = Math.max(0, prev.y - 1);
                    break;
                case 'arrowdown':
                case 's':
                    newPos.y = Math.min(GRID_SIZE - 1, prev.y + 1);
                    break;
                case 'arrowleft':
                case 'a':
                    newPos.x = Math.max(0, prev.x - 1);
                    break;
                case 'arrowright':
                case 'd':
                    newPos.x = Math.min(GRID_SIZE - 1, prev.x + 1);
                    break;
            }
            // Check for wall collision
            const finalPos = isColliding(newPos) ? prev : newPos;
            // Check for mystery point
            handleMysteryPoint(finalPos);
            return finalPos;
        });
    }, [handleMysteryPoint]);

    // Set up keyboard listeners
    useEffect(() => {
        window.addEventListener('keydown', handleMovement);
        return () => window.removeEventListener('keydown', handleMovement);
    }, [handleMovement]);

    // Add this after your existing useEffect
    useEffect(() => {
        if (!showInstructions && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            setIsGameOver(true);
        }
    }, [timeLeft, showInstructions]);

    return (
        <main className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className='text-4xl font-bold text-center mb-8'>Shadow Run</h1>
            
            {/* Game Stats */}
            <div className="flex justify-between mb-4">
                <div>Score: {score}</div>
                <div>Time Left: {timeLeft}s</div>
                <div>Points Collected: {pointsCollected}</div>
            </div>

            {/* Game Grid */}
            <div 
                className="relative mx-auto border-2 border-gray-700"
                style={{
                    width: GRID_SIZE * CELL_SIZE,
                    height: GRID_SIZE * CELL_SIZE,
                }}
            >
                {/* Walls */}
                {WALLS.map((wall, index) => (
                    <div
                        key={index}
                        className="absolute bg-gray-700"
                        style={{
                            left: wall.x * CELL_SIZE,
                            top: wall.y * CELL_SIZE,
                            width: wall.w * CELL_SIZE,
                            height: wall.h * CELL_SIZE,
                        }}
                    />
                ))}
                {/* Player */}
                <div 
                    className="absolute bg-blue-500 rounded-full transition-all duration-200"
                    style={{
                        width: CELL_SIZE - 4,
                        height: CELL_SIZE - 4,
                        left: player.x * CELL_SIZE + 2,
                        top: player.y * CELL_SIZE + 2,
                    }}
                />
                {/* Mystery Point */}
                <div 
                    className="absolute bg-yellow-500 rounded-full transition-all duration-200"
                    style={{
                        width: CELL_SIZE - 4,
                        height: CELL_SIZE - 4,
                        left: mysteryPoint.x * CELL_SIZE + 2,
                        top: mysteryPoint.y * CELL_SIZE + 2,
                    }}
                />
            </div>

            {/* Instructions */}
            {showInstructions && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center">
                    <div className="bg-gray-800 p-8 rounded-lg max-w-md">
                        <h2 className="text-2xl mb-4">How to Play</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Use arrow keys or WASD to move</li>
                            <li>Avoid gray walls - you cannot pass through them</li>
                            <li>Escape from guards</li>
                            <li>Solve runic puzzles</li>
                            <li>Collect power-ups</li>
                        </ul>
                        <button 
                            className="mt-6 px-4 py-2 bg-blue-500 rounded"
                            onClick={() => setShowInstructions(false)}
                        >
                            Start Game
                        </button>
                    </div>
                </div>
            )}

            {/* Game Over Popup */}
            {isGameOver && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center">
                    <div className="bg-gray-800 p-8 rounded-lg max-w-md">
                        <h2 className="text-2xl mb-4">Game Over!</h2>
                        <div className="space-y-2">
                            <p>Final Score: {score}</p>
                            <p>Mystery Points Collected: {pointsCollected}</p>
                            <p>Time's Up!</p>
                        </div>
                        <button 
                            className="mt-6 px-4 py-2 bg-blue-500 rounded"
                            onClick={() => {
                                setTimeLeft(30);
                                setScore(0);
                                setPointsCollected(0);
                                setPlayer(INITIAL_PLAYER);
                                setMysteryPoint(getRandomPosition());
                                setIsGameOver(false);
                            }}
                        >
                            Play Again
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default ShadowRunPage;
