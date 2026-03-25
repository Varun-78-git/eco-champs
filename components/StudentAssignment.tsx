
import React, { useState } from 'react';
import type { Assignment, User } from '../types';
import { verifyChallengeProof, type VerificationResult } from '../services/geminiService';
import { CheckCircleIcon, XIcon, XCircleIcon, ClipboardListIcon } from './icons';

interface AssignmentSubmissionModalProps {
  assignment: Assignment;
  onClose: () => void;
  onComplete: (assignment: Assignment, proofUrl: string) => void;
  isCompleted: boolean;
}

const AssignmentSubmissionModal: React.FC<AssignmentSubmissionModalProps> = ({ assignment, onClose, onComplete, isCompleted }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const handleVerification = async (fileToVerify: File) => {
    setIsVerifying(true);
    
    const reader = new FileReader();
    reader.readAsDataURL(fileToVerify);
    reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const mimeType = fileToVerify.type;
        
        const result = await verifyChallengeProof(base64String, mimeType, {
            title: assignment.title,
            description: assignment.description
        });
        
        setVerificationResult(result);
        setIsVerifying(false);
    };
    reader.onerror = () => {
        setVerificationResult({
            isValid: false,
            imageDescription: "Error reading file.",
            feedback: "Could not process the image file. Please try a different one."
        });
        setIsVerifying(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setVerificationResult(null);
      
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      
      await handleVerification(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file || !verificationResult?.isValid) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onComplete(assignment, preview!);
    setIsSubmitting(false);
  };

  const VerificationStatus = () => {
    if (isVerifying) {
        return (
             <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                <div>
                    <p className="font-semibold text-blue-700 dark:text-blue-300">Scanning your photo...</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Our AI is checking if it's valid proof.</p>
                </div>
            </div>
        );
    }

    if (verificationResult) {
        const { isValid, imageDescription, feedback } = verificationResult;
        return (
            <div className={`mt-4 p-4 rounded-lg ${isValid ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700'}`}>
                <div className="flex items-start gap-3">
                     <div className={`flex-shrink-0 mt-1 ${isValid ? 'text-green-500' : 'text-red-500'}`}>
                        {isValid ? <CheckCircleIcon className="h-6 w-6"/> : <XCircleIcon className="h-6 w-6"/>}
                     </div>
                     <div>
                        <h4 className={`font-bold ${isValid ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                            {isValid ? 'AI Analysis: Valid Proof!' : 'AI Analysis: Invalid Proof'}
                        </h4>
                        <p className="mt-1 text-sm text-text-primary">
                           <span className="font-semibold">What I see:</span> {imageDescription}
                        </p>
                        <p className={`mt-2 text-sm font-medium ${isValid ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                            <span className="font-bold">Feedback:</span> {feedback}
                        </p>
                     </div>
                </div>
            </div>
        );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md m-4 transform transition-all duration-300 scale-95 hover:scale-100">
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <XIcon />
          </button>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-primary-dark text-white p-3 rounded-full"><ClipboardListIcon /></div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">{assignment.title}</h2>
              <p className="text-secondary font-semibold">{assignment.points} Eco-Points</p>
            </div>
          </div>

          <p className="text-text-secondary">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
          <p className="text-text-secondary mb-6">{assignment.description}</p>

          {isCompleted ? (
             <div className="text-center p-6 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircleIcon className="h-16 w-16" />
                <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mt-4">Assignment Completed!</h3>
                <p className="text-green-600 dark:text-green-400">Great job, you've earned {assignment.points} points!</p>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-text-primary mb-2">Submit Your Proof</h3>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                <label htmlFor="file-upload" className="cursor-pointer text-primary hover:text-primary-dark font-semibold">
                  {file ? 'Change photo' : 'Upload a photo'}
                </label>
                {preview && <img src={preview} alt="Proof preview" className="mt-4 rounded-lg max-h-48 mx-auto" />}
              </div>

              <VerificationStatus />

              <button
                onClick={handleSubmit}
                disabled={!file || isSubmitting || !verificationResult?.isValid}
                className="w-full mt-6 bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600 dark:disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                    </>
                ) : `Complete Assignment & Earn ${assignment.points} Points`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


interface StudentAssignmentProps {
    assignments: Assignment[];
    currentUser: User;
    onComplete: (assignment: Assignment, proofUrl: string) => void;
}

const StudentAssignment: React.FC<StudentAssignmentProps> = ({ assignments, currentUser, onComplete }) => {
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const completedAssignmentIds = (currentUser.completedAssignments || []).map(a => a.assignmentId);

    return (
        <>
            <div className="bg-surface p-8 rounded-2xl shadow-xl max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-text-primary">Your Assignments</h2>
                    <p className="text-text-secondary">Complete these special tasks from your teacher to earn extra points!</p>
                </div>

                {assignments.length === 0 ? (
                     <div className="text-center p-8 bg-background rounded-lg">
                        <div className="text-5xl mb-4">🎉</div>
                        <h3 className="text-xl font-bold text-text-primary">No Assignments!</h3>
                        <p className="text-text-secondary">You're all caught up. Check back later for new assignments.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {assignments.map(assignment => {
                            const isCompleted = completedAssignmentIds.includes(assignment.id);
                            return (
                                <div key={assignment.id} className="bg-background p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                                     <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-primary">{assignment.title}</h3>
                                            <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary mt-1">
                                                <span>🏆 <span className="font-semibold">{assignment.points} Points</span></span>
                                                <span>🗓️ Due: <span className="font-semibold">{new Date(assignment.dueDate).toLocaleDateString()}</span></span>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            {isCompleted ? (
                                                <span className="px-3 py-1 text-xs font-bold text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200 rounded-full">Completed</span>
                                            ) : (
                                                <span className="px-3 py-1 text-xs font-bold text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-200 rounded-full">Not Started</span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-text-secondary mt-3">{assignment.description}</p>
                                    <button 
                                        onClick={() => setSelectedAssignment(assignment)}
                                        disabled={isCompleted}
                                        className="mt-4 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors text-sm disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                                    >
                                        {isCompleted ? 'Submitted' : 'Submit Work'}
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
            {selectedAssignment && (
                <AssignmentSubmissionModal
                    assignment={selectedAssignment}
                    onClose={() => setSelectedAssignment(null)}
                    onComplete={(assignment, proofUrl) => {
                        onComplete(assignment, proofUrl);
                        setSelectedAssignment(null);
                    }}
                    isCompleted={completedAssignmentIds.includes(selectedAssignment.id)}
                />
            )}
        </>
    );
};

export default StudentAssignment;