import React from 'react';

const AirPollutionAnimation = () => (
    <svg viewBox="0 0 200 120" className="w-full h-full" aria-labelledby="air-pollution-title">
        <title id="air-pollution-title">Animation explaining air pollution</title>
        <style>{`
          .smoke-particle { animation: smoke-rise 5s linear infinite; }
          @keyframes smoke-clean {
            0% { opacity: 0.5; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.5); }
          }
          .smoke-cleaned { animation: smoke-clean 3s linear infinite; }
        `}</style>
        {/* Background */}
        <rect width="200" height="120" fill="#5F6C7B" />
        {/* Ground */}
        <rect x="0" y="100" width="200" height="20" fill="#A9A9A9" />

        {/* Factory */}
        <g transform="translate(20, 60)">
            <rect width="30" height="40" fill="#696969" />
            <rect y="-20" width="10" height="20" fill="#808080" />
            {/* Smoke */}
            <circle cx="5" cy="-25" r="5" fill="grey" className="smoke-particle" style={{ animationDelay: '0s' }} />
            <circle cx="8" cy="-30" r="4" fill="grey" className="smoke-particle" style={{ animationDelay: '0.5s' }} />
        </g>
        
        {/* Car */}
        <g transform="translate(70, 90)">
            <rect width="30" height="10" y="-10" fill="red" />
            <circle cx="5" cy="0" r="4" fill="black" />
            <circle cx="25" cy="0" r="4" fill="black" />
             {/* Exhaust */}
            <circle cx="-5" cy="-5" r="3" fill="dimgrey" className="smoke-particle" style={{ animationDelay: '0.2s' }} />
        </g>
        
        {/* Tree */}
        <g transform="translate(150, 100)">
            <rect x="-3" y="0" width="6" height="-40" fill="brown" />
            <circle cx="0" cy="-40" r="20" fill="green" />
            <circle cx="15" cy="-45" r="15" fill="limegreen" />
            <circle cx="-15" cy="-45" r="15" fill="limegreen" />
        </g>

        {/* Cleaned smoke particles near tree */}
        <g transform="translate(120, 50)">
            <circle r="5" fill="grey" className="smoke-cleaned" style={{ animationDelay: '1s' }} />
            <circle r="4" fill="dimgrey" className="smoke-cleaned" style={{ animationDelay: '1.5s' }} />
        </g>
        
        {/* Labels */}
        <text x="10" y="20" fontSize="8" fill="white" fontWeight="bold">Sources of Pollution</text>
        <text x="130" y="30" fontSize="8" fill="white" fontWeight="bold">Trees help clean the air</text>
        <path d="M 150 35 L 150 55" stroke="white" strokeWidth="0.5" markerEnd="url(#arrow)" />

        <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="white" />
            </marker>
        </defs>
    </svg>
);

export default AirPollutionAnimation;
