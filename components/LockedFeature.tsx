import React from 'react';
import { LockClosedIcon } from './icons';

interface LockedFeatureProps {
    featureName: string;
    threshold: number;
}

const LockedFeature: React.FC<LockedFeatureProps> = ({ featureName, threshold }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 bg-surface rounded-2xl shadow-xl text-center h-[calc(100vh-15rem)]">
            <div className="p-6 bg-yellow-100 dark:bg-yellow-900/50 rounded-full text-yellow-500 dark:text-yellow-400 mb-6">
                <LockClosedIcon className="h-16 w-16" />
            </div>
            <h2 className="text-3xl font-bold text-text-primary mb-2">Feature Locked</h2>
            <p className="text-lg text-text-secondary max-w-md">
                You need to earn <span className="font-bold text-secondary">{threshold} Eco-Points</span> to unlock the <span className="font-bold text-primary">{featureName}</span>. Keep completing challenges to level up!
            </p>
        </div>
    );
};

export default LockedFeature;