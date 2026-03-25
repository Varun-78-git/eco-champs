
import React from 'react';
import { type User } from '../types';
import DigitalTwin from './DigitalTwin';
import Leaderboard from './Leaderboard';

interface CommunityHubProps {
    currentUser: User;
    allStudents: User[];
}

const CommunityHub: React.FC<CommunityHubProps> = ({ currentUser, allStudents }) => {
    const totalSchoolPoints = allStudents.reduce((sum, student) => sum + student.points, 0);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-text-primary">Community Hub</h2>
                <p className="text-text-secondary mt-1">Track your school's progress and climb the leaderboard!</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-3">
                    <Leaderboard users={allStudents} currentUserId={currentUser.id} />
                </div>
                <div className="lg:col-span-2">
                    <DigitalTwin totalPoints={totalSchoolPoints} />
                </div>
            </div>
        </div>
    );
};

export default CommunityHub;
