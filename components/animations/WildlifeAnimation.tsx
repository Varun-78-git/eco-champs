import React from 'react';

const WildlifeAnimation = () => (
    <svg viewBox="0 0 200 120" className="w-full h-full" aria-labelledby="wildlife-title">
        <title id="wildlife-title">Animation of wildlife habitat loss and protection</title>
        <style>{`
            @keyframes disappear {
                0%, 10% { opacity: 1; }
                40%, 100% { opacity: 0; }
            }
            @keyframes appear {
                0%, 60% { opacity: 0; }
                90%, 100% { opacity: 1; }
            }
            .tree { animation-duration: 10s; animation-iteration-count: infinite; }
            .tree-1 { animation-name: disappear; }
            .tree-2 { animation-name: disappear; animation-delay: 0.5s; }
            .tree-3 { animation-name: disappear; animation-delay: 1s; }
            .new-tree { animation-name: appear; }
            
            @keyframes sad-mouth {
                0%, 30% { opacity: 0; } 40%, 60% { opacity: 1; } 70%, 100% { opacity: 0; }
            }
            #tiger-sad-mouth { animation: sad-mouth 10s infinite; }

            @keyframes happy-mouth {
                0%, 70% { opacity: 0; } 80%, 100% { opacity: 1; }
            }
            #tiger-happy-mouth { animation: happy-mouth 10s infinite; }
        `}</style>
        {/* Background */}
        <rect width="200" height="120" fill="#2c3e50" />
        {/* Ground */}
        <rect x="0" y="90" width="200" height="30" fill="#78B05A" />

        {/* Forest */}
        <g className="tree tree-1">
             <path d="M 30 90 l 10 -20 l 10 20 z" fill="green" />
        </g>
        <g className="tree tree-2">
            <path d="M 50 90 l 15 -30 l 15 30 z" fill="#006400" />
        </g>
        <g className="tree tree-3">
             <path d="M 150 90 l 20 -40 l 20 40 z" fill="green" />
        </g>
        
        {/* Tiger */}
        <g transform="translate(100, 95)">
            <rect x="-15" y="-15" width="30" height="15" fill="orange" />
            <path d="M -10 -15 v 15 M 0 -15 v 15 M 10 -15 v 15" stroke="black" strokeWidth="1" />
            <circle cx="-10" cy="-10" r="2" fill="white" />
            <circle cx="10" cy="-10" r="2" fill="white" />
            <circle cx="-10" cy="-10" r="1" fill="black" />
            <circle cx="10" cy="-10" r="1" fill="black" />
            <polygon points="-2, -5, 2, -5, 0, -2" fill="pink" />
            {/* Sad Mouth */}
            <path id="tiger-sad-mouth" d="M -5 0 Q 0 -3, 5 0" stroke="black" fill="none" strokeWidth="0.5" />
            {/* Happy Mouth */}
            <path id="tiger-happy-mouth" d="M -5 0 Q 0 3, 5 0" stroke="black" fill="none" strokeWidth="0.5" />
        </g>

        {/* Protection sign and new trees */}
        <g className="new-tree" style={{ animationDuration: '10s', animationIterationCount: 'infinite' }}>
            <rect x="10" y="50" width="40" height="20" fill="brown" />
            <text x="15" y="62" fontSize="5" fill="white" fontWeight="bold">PROTECTED</text>
             <path d="M 50 90 l 15 -30 l 15 30 z" fill="#006400" />
             <path d="M 150 90 l 20 -40 l 20 40 z" fill="green" />
        </g>
        
        {/* Labels */}
        <text x="10" y="20" fontSize="8" fill="white" className="tree tree-1" fontWeight="bold">1. Habitat Loss</text>
        <text x="10" y="40" fontSize="8" fill="white" className="new-tree" fontWeight="bold">2. Protection & Reforestation</text>
    </svg>
);

export default WildlifeAnimation;
