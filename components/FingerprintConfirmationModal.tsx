import React, { useEffect, useState } from 'react';
import { dbService } from '../services/dbService';
import { FingerPrintIcon, XCircleIcon } from './icons';

interface FingerprintConfirmationModalProps {
  userId: string;
  onConfirm: () => void;
  onCancel: (error?: string) => void;
}

const FingerprintConfirmationModal: React.FC<FingerprintConfirmationModalProps> = ({ userId, onConfirm, onCancel }) => {
    const [status, setStatus] = useState<'prompting' | 'verifying' | 'error'>('prompting');

    useEffect(() => {
        const verify = async () => {
            setStatus('verifying');
            const success = await dbService.confirmActionWithFingerprint(userId);
            if (success) {
                onConfirm();
            } else {
                setStatus('error');
                setTimeout(() => onCancel('Fingerprint verification failed or was cancelled.'), 2000);
            }
        };
        // Delay slightly to allow the modal to render before the browser prompt appears
        const timer = setTimeout(verify, 300);
        return () => clearTimeout(timer);
    }, [userId, onConfirm, onCancel]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-sm m-4 p-8 text-center transform transition-all duration-300">
                <div className="mb-6">
                    {status === 'error' ? (
                         <XCircleIcon className="h-20 w-20 mx-auto text-red-500" />
                    ) : (
                         <div className="text-primary animate-pulse">
                            <FingerPrintIcon className="h-20 w-20 mx-auto" />
                        </div>
                    )}
                </div>

                {status === 'error' ? (
                     <>
                        <h2 className="text-2xl font-bold text-red-500">Verification Failed</h2>
                        <p className="text-text-secondary mt-2">Please try again.</p>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-text-primary">Confirm Action</h2>
                        <p className="text-text-secondary mt-2">Please use your fingerprint to confirm this redemption.</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default FingerprintConfirmationModal;
