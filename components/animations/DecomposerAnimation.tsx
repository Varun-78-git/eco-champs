import React from 'react';

const DecomposerAnimation = () => (
    <svg viewBox="0 0 200 120" className="w-full h-full" aria-labelledby="decomposer-title">
        <title id="decomposer-title">Animation of decomposers breaking down a leaf</title>
        {/* Background */}
        <rect width="200" height="120" fill="#2c3e50" />
        {/* Ground */}
        <rect x="0" y="90" width="200" height="30" fill="#A0522D" />
        <rect x="0" y="95" width="200" height="25" fill="#8B4513" />

        {/* Leaf */}
        <g style={{ animation: 'decompose 8s linear infinite' }}>
            <path d="M 100 80 C 80 95, 60 70, 80 50 C 90 40, 110 40, 120 50 C 140 70, 120 95, 100 80 Z" fill="#9ACD32" />
            <line x1="100" y1="80" x2="100" y2="50" stroke="#6B8E23" strokeWidth="1" />
        </g>

        {/* Fungi/Decomposers */}
        <g style={{ animation: 'grow 8s ease-in infinite' }}>
            <path d="M 70 90 Q 75 80, 80 90 Z" fill="#F5DEB3" />
            <path d="M 120 90 Q 123 85, 126 90 Z" fill="#F5DEB3" />
        </g>
        
        {/* Nutrient particles */}
        <g>
            <circle cx="100" cy="85" r="1" fill="gold" style={{ animation: 'evaporate 8s linear infinite', animationDelay: '4s' }} />
            <circle cx="90" cy="85" r="1" fill="gold" style={{ animation: 'evaporate 8s linear infinite', animationDelay: '4.5s' }} />
            <circle cx="110" cy="85" r="1" fill="gold" style={{ animation: 'evaporate 8s linear infinite', animationDelay: '5s' }} />
        </g>

        {/* New Plant Growth */}
        <g transform="translate(150, 90)" style={{ animation: 'grow 8s ease-in infinite', animationDelay: '6s' }}>
            <path d="M 0 0 V -15" stroke="green" strokeWidth="2" />
            <circle cx="-5" cy="-15" r="3" fill="limegreen" />
            <circle cx="5" cy="-15" r="3" fill="limegreen" />
        </g>

        {/* Labels */}
        <text x="10" y="20" fontSize="8" fill="white" fontWeight="bold">1. Dead Organic Matter</text>
        <path d="M 35 25 L 80 45" stroke="white" strokeWidth="0.5" markerEnd="url(#arrow)" />

        <text x="10" y="110" fontSize="8" fill="white" fontWeight="bold">2. Decomposers (Fungi)</text>
        <path d="M 40 105 L 70 92" stroke="white" strokeWidth="0.5" markerEnd="url(#arrow)" />

        <text x="130" y="20" fontSize="8" fill="white" fontWeight="bold">3. Nutrients Released</text>
        
        <text x="130" y="50" fontSize="8" fill="white" fontWeight="bold">4. New Life Grows</text>
        <path d="M 155 55 L 150 75" stroke="white" strokeWidth="0.5" markerEnd="url(#arrow)" />
        
        <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="white" />
            </marker>
        </defs>
    </svg>
);

export default DecomposerAnimation;
