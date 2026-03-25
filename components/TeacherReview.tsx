
import React, { useState } from 'react';
import type { Submission } from '../types';

interface TeacherReviewProps {
    initialSubmissions: Submission[];
}

const TimeAgo: React.FC<{ date: string }> = ({ date }) => {
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    let interval = seconds / 86400;
    if (interval > 1) return <span>{Math.floor(interval)} days ago</span>;
    interval = seconds / 3600;
    if (interval > 1) return <span>{Math.floor(interval)} hours ago</span>;
    interval = seconds / 60;
    if (interval > 1) return <span>{Math.floor(interval)} minutes ago</span>;
    return <span>just now</span>;
}

const TeacherReview: React.FC<TeacherReviewProps> = ({ initialSubmissions }) => {
    const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);

    const handleUpdateStatus = (id: string, status: 'approved' | 'rejected') => {
        setSubmissions(submissions.map(sub => sub.id === id ? { ...sub, status } : sub));
    };

    const pendingSubmissions = submissions.filter(s => s.status === 'pending');

    return (
        <div className="bg-surface p-8 rounded-2xl shadow-xl">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-text-primary">Review Submissions</h2>
                <p className="text-text-secondary">Approve or reject challenge submissions from students.</p>
            </div>

            {pendingSubmissions.length === 0 ? (
                 <div className="text-center p-8 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-5xl mb-4">🎉</div>
                    <h3 className="text-xl font-bold text-green-700 dark:text-green-300">All Caught Up!</h3>
                    <p className="text-green-600 dark:text-green-400">There are no pending submissions to review.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {pendingSubmissions.map(submission => (
                        <div key={submission.id} className="bg-background p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Proof Image */}
                                <div className="md:w-1/3">
                                     <img src={submission.proofUrl} alt="Proof" className="rounded-lg w-full h-48 object-cover" />
                                </div>

                                {/* Submission Details */}
                                <div className="flex-grow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <img src={submission.userAvatar} alt={submission.userName} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <h4 className="font-bold text-text-primary">{submission.userName}</h4>
                                            <p className="text-sm text-text-secondary">Submitted <TimeAgo date={submission.submittedAt} /></p>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-primary mb-4">{submission.title}</h3>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-3 mt-4">
                                        <button 
                                            onClick={() => handleUpdateStatus(submission.id, 'approved')}
                                            className="flex-1 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => handleUpdateStatus(submission.id, 'rejected')}
                                            className="flex-1 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeacherReview;