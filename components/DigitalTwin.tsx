import React, { useState, useEffect, useRef } from 'react';
import { ArrowsPointingOutIcon, ArrowsPointingInIcon } from './icons';

interface DigitalTwinProps {
    totalPoints: number;
}

const LEVEL_THRESHOLDS = {
    level1: 0,
    level2: 1000,
    level3: 2500,
};

const SchoolIllustration: React.FC<{ level: 1 | 2 | 3 }> = ({ level }) => {
    const commonParts = (
        <>
            {/* Ground */}
            <path d="M0 80 H100 V100 H0 Z" fill="#78B05A" />
            {/* Sky */}
            <rect width="100" height="80" fill="#87CEEB" />
            {/* Sun */}
            <circle cx="85" cy="15" r="8" fill="#FFD700" />
            {/* School Building */}
            <rect x="25" y="40" width="50" height="40" fill="#F0EAD6" stroke="#C4A484" strokeWidth="1" />
            <polygon points="22,40 78,40 50,25" fill="#D2691E" stroke="#8B4513" strokeWidth="1" />
            <rect x="35" y="60" width="10" height="20" fill="#87CEEB" stroke="#6495ED" />
            <rect x="55" y="60" width="10" height="10" fill="#87CEEB" stroke="#6495ED" />
        </>
    );

    switch (level) {
        case 1:
            return (
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    {commonParts}
                    {/* Small Sapling */}
                    <path d="M15 80 v-10 h-1 l2 -5 l2 5 h-1 v10 z" fill="#8B4513" stroke="#5C3317" />
                    <circle cx="17" cy="65" r="3" fill="#228B22" />
                    {/* Trash can */}
                    <rect x="80" y="70" width="8" height="10" fill="#A9A9A9" />
                </svg>
            );
        case 2:
            return (
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    {commonParts}
                    {/* Medium Tree */}
                    <path d="M15 80 v-15 h-2 l4 -8 l4 8 h-2 v15 z" fill="#8B4513" stroke="#5C3317" />
                    <circle cx="19" cy="57" r="8" fill="#228B22" />
                    {/* Solar Panels on Roof */}
                    <rect x="28" y="32" width="20" height="6" fill="#4682B4" transform="skewY(-17)" stroke="#000" strokeWidth="0.5" />
                    {/* Recycling Bins */}
                    <rect x="80" y="70" width="5" height="10" fill="#0000FF" />
                    <rect x="86" y="70" width="5" height="10" fill="#008000" />
                </svg>
            );
        case 3:
            return (
                 <svg viewBox="0 0 100 100" className="w-full h-full">
                    {commonParts}
                    {/* Big Tree */}
                    <path d="M15 80 v-20 h-2 l5 -10 l5 10 h-2 v20 z" fill="#8B4513" stroke="#5C3317" />
                    <circle cx="20" cy="50" r="12" fill="#006400" />
                    {/* Garden */}
                    <rect x="5" y="82" width="15" height="5" fill="#6B4423" />
                    <circle cx="8" cy="80" r="1.5" fill="#FF6347" />
                    <circle cx="12" cy="80" r="1.5" fill="#FFD700" />
                    <circle cx="16" cy="80" r="1.5" fill="#EE82EE" />
                    {/* Wind Turbine */}
                    <line x1="85" y1="80" x2="85" y2="50" stroke="#C0C0C0" strokeWidth="1" />
                    <circle cx="85" cy="50" r="1" fill="black" />
                    <path d="M85 50 L80 48 L85 46 L90 48 Z" fill="#FFFFFF" stroke="black" strokeWidth="0.5" transform="rotate(45 85 50)" />
                    {/* Bins */}
                    <rect x="80" y="70" width="5" height="10" fill="#0000FF" />
                    <rect x="86" y="70" width="5" height="10" fill="#008000" />
                </svg>
            );
    }
};

const DigitalTwin: React.FC<DigitalTwinProps> = ({ totalPoints }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    let level: 1 | 2 | 3 = 1;
    let progress = 0;
    let nextLevelPoints = LEVEL_THRESHOLDS.level2;

    if (totalPoints >= LEVEL_THRESHOLDS.level3) {
        level = 3;
        progress = 100;
        nextLevelPoints = LEVEL_THRESHOLDS.level3;
    } else if (totalPoints >= LEVEL_THRESHOLDS.level2) {
        level = 2;
        progress = ((totalPoints - LEVEL_THRESHOLDS.level2) / (LEVEL_THRESHOLDS.level3 - LEVEL_THRESHOLDS.level2)) * 100;
        nextLevelPoints = LEVEL_THRESHOLDS.level3;
    } else {
        level = 1;
        progress = (totalPoints / LEVEL_THRESHOLDS.level2) * 100;
        nextLevelPoints = LEVEL_THRESHOLDS.level2;
    }

    return (
        <div className="bg-surface p-6 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold text-center text-text-primary mb-4">Our Digital School Twin 🏫</h2>
            <div 
                ref={containerRef}
                onDoubleClick={toggleFullscreen}
                className={`relative aspect-[16/9] w-full max-w-2xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer ${isFullscreen ? 'flex items-center justify-center bg-black' : ''}`}
            >
                <SchoolIllustration level={level} />
                <button 
                    onClick={toggleFullscreen}
                    className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-20"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                    {isFullscreen ? <ArrowsPointingInIcon className="h-5 w-5" /> : <ArrowsPointingOutIcon className="h-5 w-5" />}
                </button>
            </div>
            <div className="mt-4 max-w-2xl mx-auto">
                <div className="flex justify-between items-center text-sm font-semibold mb-1">
                    <span className="text-text-secondary">Level {level}</span>
                    <span className="text-primary">{totalPoints.toLocaleString()} / {nextLevelPoints.toLocaleString()} points</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div className="bg-primary h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-center text-xs text-text-secondary mt-1">
                    {level < 3 ? `Earn ${ (nextLevelPoints - totalPoints).toLocaleString() } more points to reach Level ${level + 1}!` : 'You\'ve reached the maximum eco-level! Amazing!'}
                </p>
            </div>
        </div>
    );
};

export default DigitalTwin;
