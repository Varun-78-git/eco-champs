import React, { useState } from 'react';
import type { Assignment } from '../types';
import { PencilIcon, TrashIcon } from './icons';
import AssignmentModal from './AssignmentModal';

interface TeacherAssignmentProps {
    assignments: Assignment[];
    onAdd: (assignment: Omit<Assignment, 'id'>) => void;
    onUpdate: (assignment: Assignment) => void;
    onDelete: (id: string) => void;
}

const TeacherAssignment: React.FC<TeacherAssignmentProps> = ({ assignments, onAdd, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

    const handleCreateNew = () => {
        setEditingAssignment(null);
        setIsModalOpen(true);
    };

    const handleEdit = (assignment: Assignment) => {
        setEditingAssignment(assignment);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
            onDelete(id);
        }
    };
    
    const handleSave = (assignment: Omit<Assignment, 'id'> | Assignment) => {
        if ('id' in assignment) {
            onUpdate(assignment);
        } else {
            onAdd(assignment);
        }
        setIsModalOpen(false);
    }

    return (
        <>
            <div className="bg-surface p-8 rounded-2xl shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold text-text-primary">Class Assignments</h2>
                        <p className="text-text-secondary">Create and manage custom challenges for your students.</p>
                    </div>
                    <button onClick={handleCreateNew} className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap">
                       + Create New Assignment
                    </button>
                </div>

                {assignments.length === 0 ? (
                     <div className="text-center p-8 bg-background rounded-lg">
                        <div className="text-5xl mb-4">📝</div>
                        <h3 className="text-xl font-bold text-text-primary">No Assignments Yet</h3>
                        <p className="text-text-secondary">Click "Create New Assignment" to get started.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {assignments.map(assignment => (
                            <div key={assignment.id} className="bg-background p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                                 <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-primary">{assignment.title}</h3>
                                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary mt-1">
                                            <span>🏆 <span className="font-semibold">{assignment.points} Points</span></span>
                                            <span>👥 Assigned to: <span className="font-semibold">{assignment.assignedTo}</span></span>
                                            <span>🗓️ Due: <span className="font-semibold">{new Date(assignment.dueDate).toLocaleDateString()}</span></span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <button onClick={() => handleEdit(assignment)} className="p-2 text-blue-500 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full transition-colors" aria-label="Edit assignment"><PencilIcon /></button>
                                        <button onClick={() => handleDelete(assignment.id)} className="p-2 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors" aria-label="Delete assignment"><TrashIcon /></button>
                                    </div>
                                </div>
                                <p className="text-text-secondary mt-3">{assignment.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {isModalOpen && (
                <AssignmentModal 
                    assignment={editingAssignment}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </>
    );
};

export default TeacherAssignment;