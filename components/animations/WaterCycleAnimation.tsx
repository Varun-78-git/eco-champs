import React from 'react';

const WaterCycleAnimation = () => (
    <svg viewBox="0 0 200 120" className="w-full h-full" aria-labelledby="water-cycle-title">
      <title id="water-cycle-title">Animation of the water cycle</title>
      <defs>
        <g id="evaporation-particle">
          <circle cx="0" cy="0" r="1.5" fill="rgba(173, 216, 230, 0.7)" />
        </g>
        <g id="rain-drop">
          <path d="M 0 0 C -2 -5, 2 -5, 0 0 Z" fill="rgba(65, 105, 225, 0.8)" transform="scale(1.5)" />
        </g>
      </defs>
      
      {/* Sky and Sun */}
      <rect width="200" height="90" fill="skyblue" />
      <circle cx="170" cy="30" r="15" fill="gold" style={{ animation: 'sun-pulse 4s infinite' }} />

      {/* Ground and Water */}
      <path d="M 0 90 H 200 V 120 H 0 Z" fill="#228B22" />
      <path d="M 0 90 C 40 80, 80 100, 120 90 S 160 80, 200 90 V 120 H 0 Z" fill="royalblue" />

      {/* Evaporation */}
      <g transform="translate(40, 88)">
        <use href="#evaporation-particle" style={{ animation: 'evaporate 3s linear infinite', animationDelay: '0s' }} />
        <use href="#evaporation-particle" transform="translate(10, 0)" style={{ animation: 'evaporate 3s linear infinite', animationDelay: '0.5s' }} />
        <use href="#evaporation-particle" transform="translate(20, 0)" style={{ animation: 'evaporate 3s linear infinite', animationDelay: '1s' }} />
        <use href="#evaporation-particle" transform="translate(30, 0)" style={{ animation: 'evaporate 3s linear infinite', animationDelay: '1.5s' }} />
      </g>
      
      {/* Cloud */}
      <g transform="translate(80, 40)" style={{ animation: 'cloud-move 5s ease-in-out infinite' }}>
        <circle cx="0" cy="0" r="15" fill="white" />
        <circle cx="15" cy="5" r="12" fill="white" />
        <circle cx="-15" cy="5" r="12" fill="white" />
      </g>

      {/* Precipitation */}
      <g transform="translate(80, 60)">
        <use href="#rain-drop" transform="translate(0, 0)" style={{ animation: 'rain-fall 2s linear infinite', animationDelay: '0s' }} />
        <use href="#rain-drop" transform="translate(10, 0)" style={{ animation: 'rain-fall 2s linear infinite', animationDelay: '0.3s' }} />
        <use href="#rain-drop" transform="translate(-10, 0)" style={{ animation: 'rain-fall 2s linear infinite', animationDelay: '0.6s' }} />
        <use href="#rain-drop" transform="translate(5, 0)" style={{ animation: 'rain-fall 2s linear infinite', animationDelay: '0.9s' }} />
      </g>

      {/* Labels */}
      <text x="10" y="20" fontSize="8" className="fill-text-primary" fontWeight="bold">Evaporation</text>
      <text x="110" y="30" fontSize="8" className="fill-text-primary" fontWeight="bold">Condensation</text>
      <text x="110" y="70" fontSize="8" className="fill-text-primary" fontWeight="bold">Precipitation</text>
      <text x="150" y="110" fontSize="8" className="fill-text-primary" fontWeight="bold">Collection</text>
    </svg>
);

export default WaterCycleAnimation;