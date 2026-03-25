import React from 'react';

const PollinatorAnimation = () => (
    <svg viewBox="0 0 200 120" className="w-full h-full" aria-labelledby="pollinator-title">
        <title id="pollinator-title">Animation of a bee pollinating flowers</title>
        <style>{`
          #bee {
            animation: bee-buzz 0.1s infinite, bee-path 10s ease-in-out infinite;
          }
          @keyframes bee-path {
            0% { transform: translate(50px, 70px) scale(0.3); }
            20% { transform: translate(50px, 70px) scale(0.3); }
            40% { transform: translate(150px, 70px) scale(0.3); }
            60% { transform: translate(150px, 70px) scale(0.3); }
            100% { transform: translate(50px, 70px) scale(0.3); }
          }
          #pollen {
            animation: pollen-path 10s linear infinite;
            opacity: 0;
          }
          @keyframes pollen-path {
             30% { transform: translate(50px, 70px); opacity: 1; }
             40% { transform: translate(150px, 70px); opacity: 1; }
             41% { transform: translate(150px, 70px); opacity: 0; }
             100% { opacity: 0; }
          }
          #fruit {
             animation: fruit-grow 10s linear infinite;
             transform: scale(0);
             transform-origin: 150px 70px;
          }
          @keyframes fruit-grow {
              0%, 50% { transform: scale(0); }
              70% { transform: scale(1); }
              100% { transform: scale(1); }
          }
        `}</style>
        {/* Sky Background */}
        <rect width="200" height="120" fill="#2c3e50" />
        
        {/* Ground */}
        <rect x="0" y="90" width="200" height="30" fill="#78B05A" />
        
        {/* Flower 1 */}
        <g transform="translate(50, 90)">
            <path d="M 0 0 V -20" stroke="green" strokeWidth="2" />
            <circle cx="0" cy="-20" r="10" fill="pink" />
            <circle cx="0" cy="-20" r="3" fill="yellow" />
        </g>

        {/* Flower 2 */}
        <g transform="translate(150, 90)">
            <path d="M 0 0 V -20" stroke="green" strokeWidth="2" />
            <circle cx="0" cy="-20" r="10" fill="purple" />
            <circle cx="0" cy="-20" r="3" fill="white" />
        </g>

        {/* Fruit on Flower 2 */}
        <g id="fruit">
             <circle cx="150" cy="70" r="8" fill="red" />
             <path d="M 150 62 L 152 58" stroke="brown" strokeWidth="1" />
        </g>
        
        {/* Pollen */}
        <g id="pollen">
            <circle r="1" fill="gold" />
            <circle r="1" fill="gold" transform="translate(2,1)" />
            <circle r="1" fill="gold" transform="translate(-1,2)" />
        </g>

        {/* Bee */}
        <g id="bee">
            {/* Body */}
            <ellipse cx="0" cy="0" rx="15" ry="8" fill="gold" />
            <path d="M -10 -4 L 10 -4 M -12 0 L 12 0 M-10 4 L 10 4" stroke="black" strokeWidth="2" />
            {/* Wings */}
            <ellipse cx="-5" cy="-8" rx="5" ry="10" fill="rgba(255,255,255,0.7)" />
            {/* Stinger */}
            <path d="M 15 0 L 20 0" stroke="black" strokeWidth="2" />
        </g>
        
        {/* Labels */}
        <text x="10" y="20" fontSize="8" fill="white" fontWeight="bold">1. Bee collects pollen</text>
        <text x="100" y="40" fontSize="8" fill="white" fontWeight="bold">2. Pollen is transferred</text>
        <text x="100" y="105" fontSize="8" fill="white" fontWeight="bold">
            <tspan x="100" dy="0">3. Flower is fertilized</tspan>
            <tspan x="100" dy="8">and grows a fruit</tspan>
        </text>
    </svg>
);

export default PollinatorAnimation;