import React, { useState } from 'react';
import type { Challenge } from '../types';
import { verifyChallengeProof, type VerificationResult } from '../services/geminiService';
import { CheckCircleIcon, XIcon, XCircleIcon } from './icons';

interface ChallengeModalProps {
  challenge: Challenge;
  onClose: () => void;
  onComplete: (challenge: Challenge, proofUrl: string) => void;
  isCompleted: boolean;
}

const ChallengeModal: React.FC<ChallengeModalProps> = ({ challenge, onClose, onComplete, isCompleted }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const handleVerification = async (fileToVerify: File) => {
    setIsVerifying(true);
    
    // Convert file to base64
    const reader = new FileReader();
    reader.readAsDataURL(fileToVerify);
    reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const mimeType = fileToVerify.type;
        
        const result = await verifyChallengeProof(base64String, mimeType, {
            title: challenge.title,
            description: challenge.description
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
      setVerificationResult(null); // Reset previous verification
      
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      
      await handleVerification(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file || !verificationResult?.isValid) return;
    setIsSubmitting(true);
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // In a real app, you would upload the file and get a URL.
    // For this demo, we'll use the local object URL.
    onComplete(challenge, preview!);
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
          
          {challenge.image && (
            <div className="w-full h-40 mb-4 overflow-hidden rounded-xl">
              <img 
                src={challenge.image} 
                alt={challenge.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-primary-dark text-white p-3 rounded-full">{challenge.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">{challenge.title}</h2>
              <p className="text-secondary font-semibold">{challenge.points} Eco-Points</p>
            </div>
          </div>

          <p className="text-text-secondary mb-6">{challenge.description}</p>

          {isCompleted ? (
             <div className="text-center p-6 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircleIcon className="h-16 w-16" />
                <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mt-4">Challenge Completed!</h3>
                <p className="text-green-600 dark:text-green-400">Great job, you've earned {challenge.points} points!</p>
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
                ) : `Complete Challenge & Earn ${challenge.points} Points`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
// fix: Export ChallengeModal as default to fix import errors.
export default ChallengeModal;
