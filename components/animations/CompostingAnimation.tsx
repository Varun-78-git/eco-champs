import React from 'react';

const CompostingAnimation = () => (
    <svg viewBox="0 0 200 120" className="w-full h-full" aria-labelledby="compost-title">
        <title id="compost-title">Animation of the composting process</title>
        <style>{`
            @keyframes fall-in {
                0% { transform: translateY(-30px); opacity: 0; }
                100% { transform: translateY(0); opacity: 1; }
            }
            .scrap { animation: fall-in 1s ease-out forwards; }
            @keyframes turn-to-soil {
                0%, 30% { opacity: 1; }
                60%, 100% { opacity: 0; }
            }
            #scraps { animation: turn-to-soil 8s infinite; }
            @keyframes soil-appear {
                0%, 40% { opacity: 0; }
                70%, 100% { opacity: 1; }
            }
            #soil { animation: soil-appear 8s infinite; }
            @keyframes plant-grow {
                 0%, 70% { transform: scaleY(0); }
                 100% { transform: scaleY(1); }
            }
            #new-plant { animation: plant-grow 8s infinite; transform-origin: bottom; }
        `}</style>

        {/* Background */}
        <rect width="200" height="120" fill="#2c3e50" />

        {/* Compost Bin */}
        <rect x="70" y="60" width="60" height="50" fill="#8B4513" />
        <path d="M 70 60 H 130 M 70 75 H 130 M 70 90 H 130 M 70 105 H 130" stroke="#A0522D" strokeWidth="1" />
        <text x="78" y="55" fontSize="8" fill="white" fontWeight="bold">Compost Bin</text>
        
        {/* Scraps Falling In */}
        <g transform="translate(100, 80)">
             <g id="scraps">
                {/* Apple Core */}
                <path d="M 0 0 C -5 -5, 5 -5, 0 0 M -2 0 v 5" fill="none" stroke="red" strokeWidth="1" className="scrap" style={{animationDelay: '0s'}}/>
                {/* Banana Peel */}
                <path d="M 10 5 C 15 0, 20 0, 25 5" fill="none" stroke="gold" strokeWidth="2" className="scrap" style={{animationDelay: '0.5s'}}/>
                {/* Egg Shell */}
                <path d="M -10 10 C -12 5, -8 5, -10 10 Z" fill="beige" stroke="black" strokeWidth="0.5" className="scrap" style={{animationDelay: '1s'}}/>
             </g>
        </g>
        
        {/* Soil */}
        <g id="soil">
            <rect x="75" y="90" width="50" height="15" fill="#654321" />
        </g>

        {/* Plant growing from compost */}
        <g id="new-plant" transform="translate(160, 110)">
            <rect y="-20" width="20" height="20" fill="#6B4423" />
            <path d="M 10 -20 V -40" stroke="green" strokeWidth="2" />
            <circle cx="5" cy="-40" r="4" fill="limegreen" />
            <circle cx="15" cy="-40" r="4" fill="limegreen" />
        </g>

        {/* Labels and Arrows */}
        <text x="10" y="20" fontSize="8" fill="white" fontWeight="bold">1. Add Kitchen Scraps</text>
        <path d="M 40 25 L 90 45" stroke="white" strokeWidth="0.5" markerEnd="url(#arrow)" />
        
        <text x="10" y="80" fontSize="8" fill="white" fontWeight="bold" style={{animation: 'soil-appear 8s infinite'}}>2. Decomposes into Soil</text>
        <path d="M 50 85 L 70 95" stroke="white" strokeWidth="0.5" markerEnd="url(#arrow)" style={{animation: 'soil-appear 8s infinite'}} />

        <text x="130" y="70" fontSize="8" fill="white" fontWeight="bold" style={{animation: 'soil-appear 8s infinite'}}>3. Use as Fertilizer</text>
        <path d="M 130 90 C 140 90, 140 100, 155 100" fill="none" stroke="white" strokeWidth="0.5" markerEnd="url(#arrow)" style={{animation: 'soil-appear 8s infinite'}} />

        <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="white" />
            </marker>
        </defs>
    </svg>
);

export default CompostingAnimation;
