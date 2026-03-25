import React from 'react';
import type { Announcement } from '../types';
import { MegaphoneIcon } from './icons';

interface TeacherAnnouncementProps {
    announcement: Announcement;
}

const TeacherAnnouncement: React.FC<TeacherAnnouncementProps> = ({ announcement }) => {
    return (
        <div className="bg-primary/10 dark:bg-primary/20 border-l-4 border-primary p-4 rounded-r-lg shadow-md">
            <div className="flex items-start gap-4">
                <div className="text-primary mt-1">
                    <MegaphoneIcon className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-bold text-primary">A Message from Your Teacher</h3>
                    <p className="text-text-primary mt-1">{announcement.text}</p>
                </div>
            </div>
        </div>
    );
};

export default TeacherAnnouncement;
