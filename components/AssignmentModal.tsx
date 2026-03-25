import React, { useState, useEffect } from 'react';
import type { Assignment } from '../types';
import { XIcon } from './icons';

interface AssignmentModalProps {
  assignment?: Assignment | null;
  onClose: () => void;
  onSave: (assignment: Omit<Assignment, 'id'> | Assignment) => void;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({ assignment, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [points, setPoints] = useState(50);
    const [dueDate, setDueDate] = useState('');
    const [assignedTo, setAssignedTo] = useState<'all' | 'Class 5' | 'Class 6'>('all');

    useEffect(() => {
        if (assignment) {
            setTitle(assignment.title);
            setDescription(assignment.description);
            setPoints(assignment.points);
            setDueDate(assignment.dueDate);
            setAssignedTo(assignment.assignedTo);
        } else {
            setTitle('');
            setDescription('');
            setPoints(50);
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            setDueDate(nextWeek.toISOString().split('T')[0]);
            setAssignedTo('all');
        }
    }, [assignment]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const assignmentData = { title, description, points, dueDate, assignedTo };
        if (assignment) {
            onSave({ ...assignment, ...assignmentData });
        } else {
            onSave(assignmentData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg m-4 transform transition-all duration-300">
                <div className="p-6 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" aria-label="Close">
                        <XIcon />
                    </button>
                    <h2 className="text-2xl font-bold text-text-primary mb-4">{assignment ? 'Edit Assignment' : 'Create New Assignment'}</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-bold text-text-secondary mb-1">Title</label>
                            <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 bg-background rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" required />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-bold text-text-secondary mb-1">Description</label>
                            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className="w-full h-24 p-2 bg-background rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" required />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label htmlFor="points" className="block text-sm font-bold text-text-secondary mb-1">Points</label>
                                <input id="points" type="number" value={points} onChange={e => setPoints(parseInt(e.target.value, 10))} className="w-full p-2 bg-background rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" required min="0" />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="dueDate" className="block text-sm font-bold text-text-secondary mb-1">Due Date</label>
                                <input id="dueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-2 bg-background rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" required />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="assignedTo" className="block text-sm font-bold text-text-secondary mb-1">Assign To</label>
                            <select id="assignedTo" value={assignedTo} onChange={e => setAssignedTo(e.target.value as any)} className="w-full p-2 bg-background rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary">
                                <option value="all">All Students</option>
                                <option value="Class 5">Class 5</option>
                                <option value="Class 6">Class 6</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-text-primary font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancel</button>
                            <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark transition-colors">{assignment ? 'Save Changes' : 'Create Assignment'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AssignmentModal;