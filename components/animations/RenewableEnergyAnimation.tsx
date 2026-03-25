import React from 'react';

const RenewableEnergyAnimation = () => (
    <svg viewBox="0 0 200 120" className="w-full h-full" aria-labelledby="renewable-title">
        <title id="renewable-title">Animation of solar and wind renewable energy</title>
        <style>{`
            .sun-ray { animation: sun-pulse 2s infinite; transform-origin: center; }
            .energy-flow { stroke-dasharray: 2 2; animation: energy-dash 1s linear infinite; }
            @keyframes energy-dash { to { stroke-dashoffset: -4; } }
            #turbine-blades { animation: spin 4s linear infinite; transform-origin: center; }
        `}</style>
        
        {/* Background */}
        <rect width="200" height="120" fill="#2c3e50" />

        {/* Sun */}
        <g transform="translate(40, 30)">
            <circle r="12" fill="gold" />
            <path className="sun-ray" d="M 0 -15 v-5 M 0 15 v 5 M -15 0 h -5 M 15 0 h 5 M -11 -11 l -3 -3 M 11 11 l 3 3 M -11 11 l -3 3 M 11 -11 l 3 -3" 
                  stroke="gold" strokeWidth="2" strokeLinecap="round" />
        </g>
        
        {/* Solar Panel */}
        <g transform="translate(30, 80) rotate(-20)">
            <rect width="40" height="20" fill="#000080" />
            <path d="M 0 10 H 40 M 20 0 V 20 M 10 0 V 20 M 30 0 V 20" stroke="#ADD8E6" strokeWidth="0.5" />
        </g>
        <line x1="50" y1="90" x2="50" y2="110" stroke="grey" strokeWidth="2" />

        {/* Energy Flow to Bulb */}
        <path d="M 50 70 C 50 50, 80 50, 80 70" stroke="yellow" strokeWidth="1" fill="none" className="energy-flow" />

        {/* Lightbulb */}
        <g transform="translate(80, 80)">
            <path d="M 0 0 C -10 0, -10 -15, 0 -15 S 10 0, 0 0" fill="yellow" />
            <rect x="-3" y="0" width="6" height="3" fill="grey" />
        </g>
        
        {/* Wind Turbine */}
        <g transform="translate(150, 70)">
            <rect x="-2" y="0" width="4" height="40" fill="lightgrey" />
            <g id="turbine-blades">
                <path d="M 0 0 Q 15 -5, 20 0 Z" fill="white" stroke="grey" strokeWidth="0.5" />
                <path d="M 0 0 Q 15 -5, 20 0 Z" fill="white" stroke="grey" strokeWidth="0.5" transform="rotate(120)" />
                <path d="M 0 0 Q 15 -5, 20 0 Z" fill="white" stroke="grey" strokeWidth="0.5" transform="rotate(240)" />
            </g>
        </g>

        {/* Energy Flow to House */}
         <path d="M 150 70 C 150 50, 180 50, 180 70" stroke="yellow" strokeWidth="1" fill="none" className="energy-flow" />

        {/* House */}
        <g transform="translate(170, 80)">
             <rect width="20" height="15" fill="#D2691E" />
             <polygon points="0,0 20,0 10,-8" fill="#8B4513" />
        </g>

        {/* Labels */}
        <text x="10" y="20" fontSize="8" fill="white" fontWeight="bold">Solar Power</text>
        <text x="130" y="20" fontSize="8" fill="white" fontWeight="bold">Wind Power</text>
    </svg>
);

export default RenewableEnergyAnimation;
