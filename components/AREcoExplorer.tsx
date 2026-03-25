import React, { useState, useRef, useEffect, useCallback } from 'react';
import { identifyImage } from '../services/geminiService';
import { CameraIcon, SparklesIcon, VideoCameraSlashIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon } from './icons';

const AREcoExplorer: React.FC = () => {
    const [cameraStatus, setCameraStatus] = useState<'starting' | 'running' | 'stopped' | 'error'>('starting');
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const startCamera = useCallback(async () => {
        // Stop any existing stream before starting a new one
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        setCameraStatus('starting');
        setResult(null);
        setError(null);
        
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
                audio: false
            });
            setStream(mediaStream);
            setCameraStatus('running');
        } catch (err) {
            console.error("Error accessing media devices.", err);
            setError("Camera access denied. Please enable permissions in your browser settings to use the Eco-Explorer.");
            setCameraStatus('error');
        }
    }, [stream]);

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            setCameraStatus('stopped');
        }
    }, [stream]);

    // Effect to start the camera on mount
    useEffect(() => {
        startCamera();
        
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []); // This should run once on mount

    // Effect for cleanup on unmount
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        }
    }, [stream]);


    // Effect to attach the stream to the video element.
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    const handleScan = useCallback(async () => {
        if (!videoRef.current || !canvasRef.current || cameraStatus !== 'running') return;
        
        setIsLoading(true);
        setResult(null);

        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (!context) {
            setIsLoading(false);
            return;
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const base64Data = imageDataUrl.split(',')[1];

        stopCamera();

        const analysisResult = await identifyImage(base64Data, 'image/jpeg');
        setResult(analysisResult);
        setIsLoading(false);
    }, [cameraStatus, stopCamera]);

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const renderCameraView = () => {
        switch (cameraStatus) {
            case 'starting':
                return (
                    <div className="flex flex-col items-center justify-center text-white p-4">
                        <CameraIcon className="w-16 h-16 animate-pulse text-primary" />
                        <p className="mt-4 font-semibold">Starting camera...</p>
                    </div>
                );
            case 'error':
                return (
                     <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 text-white">
                        <VideoCameraSlashIcon className="w-16 h-16 text-red-500 mb-4" />
                        <h3 className="text-xl font-semibold">Camera Error</h3>
                        <p className="text-gray-400 max-w-sm">{error}</p>
                        <button onClick={startCamera} className="mt-4 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                            Try Again
                        </button>
                    </div>
                );
            case 'running':
                return (
                    <>
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            muted 
                            playsInline 
                            className="w-full h-full object-cover cursor-pointer"
                            onDoubleClick={toggleFullscreen}
                            title="Double click for fullscreen"
                        ></video>
                        <div className="absolute bottom-6 flex justify-center w-full gap-4">
                            <button
                                onClick={handleScan}
                                disabled={isLoading}
                                className="w-20 h-20 bg-white rounded-full border-4 border-primary-dark shadow-2xl flex items-center justify-center transition-transform transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Scan object"
                            >
                                <CameraIcon className="w-10 h-10 text-primary" />
                            </button>
                            <button
                                onClick={toggleFullscreen}
                                className="w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                            >
                                {isFullscreen ? <ArrowsPointingInIcon className="w-6 h-6" /> : <ArrowsPointingOutIcon className="h-6 w-6" />}
                            </button>
                        </div>
                    </>
                );
            case 'stopped':
            default:
                 // This state is hit after scanning, while waiting for the result. We show a loader.
                 return null;
        }
    }

    return (
        <div ref={containerRef} className="flex flex-col h-full bg-black">
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                {!result && renderCameraView()}
                
                {isLoading && !result && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                         <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mb-4"></div>
                         <p className="font-semibold">Analyzing your image...</p>
                    </div>
                )}
                
                <canvas ref={canvasRef} className="hidden"></canvas>
            </div>

            {result && (
                <div className="p-6 bg-surface text-text-primary h-1/2 overflow-y-auto">
                     <div className="flex items-center gap-3 mb-3">
                        <SparklesIcon className="w-6 h-6 text-primary flex-shrink-0" />
                        <h2 className="text-2xl font-bold">Eco-Explorer Analysis</h2>
                    </div>
                    <p className="whitespace-pre-wrap text-text-secondary">{result}</p>
                    <button onClick={startCamera} className="mt-6 w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                        Scan Another Item
                    </button>
                </div>
            )}
        </div>
    );
};

export default AREcoExplorer;
