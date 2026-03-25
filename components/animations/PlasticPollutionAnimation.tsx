import React from 'react';

const PlasticPollutionAnimation = () => (
    <svg viewBox="0 0 200 120" className="w-full h-full" aria-labelledby="plastic-title">
        <title id="plastic-title">Animation of plastic pollution in the ocean</title>
        <style>{`
            @keyframes bottle-path {
                0% { transform: translate(20px, 80px) rotate(20deg); }
                20% { transform: translate(20px, 80px) rotate(20deg); }
                40% { transform: translate(80px, 95px) rotate(0deg); }
                100% { transform: translate(80px, 95px) rotate(0deg); }
            }
            #plastic-bottle { animation: float-bob 4s infinite, bottle-path 10s linear infinite; }
            
            @keyframes microplastics {
                0%, 50% { opacity: 0; }
                70% { opacity: 1; transform: translate(0,0); }
                100% { opacity: 0; transform: translate(20px, 5px); }
            }
            .micro { animation: microplastics 10s linear infinite; }

            @keyframes bottle-fade {
                 0%, 50% { opacity: 1; }
                 70%, 100% { opacity: 0; }
            }
            #bottle-body { animation: bottle-fade 10s linear infinite; }

            @keyframes fish-sad {
                0%, 70% { opacity: 0; }
                80%, 100% { opacity: 1; }
            }
            #fish-sad-mouth { animation: fish-sad 10s linear infinite; }
        `}</style>
        
        {/* Sky */}
        <rect width="200" height="90" fill="#2c3e50" />

        {/* Land */}
        <path d="M 0 90 L 40 90 L 50 120 L 0 120 Z" fill="#D2B48C" />

        {/* Water */}
        <rect x="0" y="90" width="200" height="30" fill="rgba(0, 119, 190, 0.7)" />
        <rect x="0" y="95" width="200" height="25" fill="rgba(0, 119, 190, 0.5)" />

        {/* Plastic Bottle */}
        <g id="plastic-bottle">
            <g id="bottle-body">
                <rect x="-10" y="-3" width="20" height="6" fill="white" stroke="black" strokeWidth="0.5" />
                <path d="M -2 -3 L 2 -3 L 2 -8 L -2 -8 Z" fill="red" />
            </g>

            {/* Microplastics */}
            <g>
                <circle className="micro" r="0.5" fill="white" style={{ animationDelay: '0s' }} />
                <circle className="micro" r="0.5" fill="white" transform="translate(2,1)" style={{ animationDelay: '0.1s' }} />
                <circle className="micro" r="0.5" fill="white" transform="translate(-1,2)" style={{ animationDelay: '0.2s' }} />
                <circle className="micro" r="0.5" fill="white" transform="translate(3,-1)" style={{ animationDelay: '0.3s' }} />
            </g>
        </g>
        
        {/* Fish */}
        <g transform="translate(150, 100)">
            <path d="M 0 0 C -20 -10, -20 10, 0 0 L 10 -5 L 10 5 Z" fill="orange" />
            <circle cx="-5" cy="-2" r="1" fill="black" />
            {/* Happy mouth */}
            <path d="M -12 2 Q -8 4, -5 2" stroke="black" strokeWidth="0.5" fill="none" />
            {/* Sad mouth */}
            <path id="fish-sad-mouth" d="M -12 2 Q -8 0, -5 2" stroke="black" strokeWidth="0.5" fill="none" />
        </g>

        {/* Labels */}
        <text x="10" y="20" fontSize="8" fill="white" fontWeight="bold">1. Plastic enters the ocean</text>
        <text x="10" y="50" fontSize="8" fill="white" fontWeight="bold">2. It breaks down into tiny microplastics</text>
        <text x="100" y="80" fontSize="8" fill="white" fontWeight="bold">3. Marine life is harmed</text>
    </svg>
);

export default PlasticPollutionAnimation;
