
import React, { useState } from 'react';
import { AppView, type User, type Assignment, type Submission, type Announcement } from '../types';
import { XIcon, ClipboardListIcon, ClipboardDocumentCheckIcon, FireIcon, UsersIcon, TrophyIcon } from './icons';

interface TeacherDashboardProps {
    users: User[];
    assignments: Assignment[];
    submissions: Submission[];
    announcement: Announcement | null;
    onAddAnnouncement: (text: string) => void;
    onDeleteAnnouncement: () => void;
    setActiveView: (view: AppView) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactElement }> = ({ title, value, icon }) => (
    <div className="bg-background p-4 rounded-xl shadow-sm flex items-center gap-4">
        <div className="bg-primary/10 text-primary p-3 rounded-lg">{icon}</div>
        <div>
            <p className="text-sm text-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
        </div>
    </div>
);

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ users, assignments, submissions, announcement, onAddAnnouncement, onDeleteAnnouncement, setActiveView }) => {
    const [announcementText, setAnnouncementText] = useState('');

    const totalPoints = users.reduce((sum, user) => sum + user.points, 0);
    const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;

    const handlePostAnnouncement = () => {
        if (!announcementText.trim()) return;
        onAddAnnouncement(announcementText);
        setAnnouncementText('');
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-text-primary">Teacher Dashboard</h1>
                <p className="text-text-secondary mt-1">Oversee your class's eco-journey.</p>
            </div>

            {/* Stats & Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Students" value={users.length} icon={<UsersIcon className="h-6 w-6"/>} />
                <StatCard title="Class Points" value={totalPoints.toLocaleString()} icon={<TrophyIcon className="h-6 w-6"/>} />
                <div onClick={() => setActiveView(AppView.TEACHER_REVIEW)} className="cursor-pointer transition-transform transform hover:scale-105">
                    <StatCard title="Pending Submissions" value={pendingSubmissions} icon={<ClipboardDocumentCheckIcon className="h-6 w-6"/>} />
                </div>
                <div onClick={() => setActiveView(AppView.ASSIGNMENTS)} className="cursor-pointer transition-transform transform hover:scale-105">
                    <StatCard title="Active Assignments" value={assignments.length} icon={<ClipboardListIcon className="h-6 w-6"/>} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Student List */}
                <div className="lg:col-span-2 bg-surface p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-text-primary mb-4">Student Progress</h2>
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                        {users.sort((a,b) => b.points - a.points).map((user, index) => (
                            <div key={user.id} className="flex items-center p-3 rounded-lg bg-background">
                                <span className="font-bold text-text-secondary w-8">{index + 1}</span>
                                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-4" />
                                <div className="flex-grow">
                                    <p className="font-semibold text-text-primary">{user.name}</p>
                                    <p className="text-xs text-text-secondary">{user.completedChallenges.length} challenges completed</p>
                                </div>
                                <div className="flex items-center gap-1 text-orange-500 text-sm font-semibold mr-4">
                                    <FireIcon className="h-4 w-4" /> {user.dailyStreak}
                                </div>
                                <span className="font-bold text-primary">{user.points} pts</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Announcements */}
                <div className="bg-surface p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-text-primary mb-4">Post Announcement</h2>
                    <p className="text-text-secondary text-sm mb-4">Post a short message that will appear on every student's dashboard.</p>
                    
                    {announcement && (
                        <div className="bg-primary/10 p-3 rounded-lg mb-4 relative">
                            <p className="text-primary-dark dark:text-primary text-sm font-medium pr-6">{announcement.text}</p>
                            <button onClick={onDeleteAnnouncement} className="absolute top-2 right-2 text-primary/50 hover:text-primary">
                                <XIcon className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                    
                    <textarea
                        value={announcementText}
                        onChange={(e) => setAnnouncementText(e.target.value)}
                        placeholder="e.g., Don't forget the compost project is due Friday!"
                        className="w-full h-24 p-2 bg-background rounded-md text-text-primary border-2 border-transparent focus:border-primary focus:outline-none transition"
                        maxLength={150}
                    />
                    <button
                        onClick={handlePostAnnouncement}
                        className="w-full mt-3 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400"
                        disabled={!announcementText.trim()}
                    >
                        {announcement ? 'Update Announcement' : 'Post Announcement'}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default TeacherDashboard;