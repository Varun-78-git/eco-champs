import React, { useState, useEffect, useRef } from 'react';
import { PhoneXMarkIcon, VideoCameraIcon, VideoCameraSlashIcon, MicrophoneIcon, MicrophoneSlashIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon } from './icons';

interface GroupVideoCallProps {
    onHangUp: () => void;
}

const GroupVideoCall: React.FC<GroupVideoCallProps> = ({ onHangUp }) => {
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // This effect handles acquiring and cleaning up the media stream.
    useEffect(() => {
        let isMounted = true;
        let mediaStream: MediaStream | null = null;
        
        const getMedia = async () => {
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (isMounted) {
                    setStream(mediaStream);
                }
            } catch (err) {
                console.error("Error accessing media devices.", err);
                if (isMounted) {
                    setError("Camera and microphone access denied. Please enable permissions in your browser settings.");
                }
            }
        };

        getMedia();

        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            isMounted = false;
            // When component unmounts, stop all tracks from this stream
            mediaStream?.getTracks().forEach(track => track.stop());
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    // This effect is responsible for attaching the stream to the video element.
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    const toggleCamera = () => {
        if (stream) {
            stream.getVideoTracks().forEach(track => track.enabled = !isCameraOn);
            setIsCameraOn(!isCameraOn);
        }
    };

    const toggleMic = () => {
        if (stream) {
            stream.getAudioTracks().forEach(track => track.enabled = !isMicOn);
            setIsMicOn(!isMicOn);
        }
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const handleHangUp = () => {
        stream?.getTracks().forEach(track => track.stop());
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        onHangUp();
    };
    
    const mockParticipants = [
        { name: 'Rohan V.', avatar: 'https://picsum.photos/seed/rohan/100/100' },
        { name: 'Aisha K.', avatar: 'https://picsum.photos/seed/aisha/100/100' },
    ];

    return (
        <div ref={containerRef} className={`relative flex flex-col ${isFullscreen ? 'h-screen w-screen' : 'h-[calc(100vh-10rem)]'} bg-black rounded-2xl shadow-2xl overflow-hidden text-white`}>
            
            {/* Main User Video */}
            <div className="w-full h-full flex items-center justify-center">
                {error ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                        <VideoCameraSlashIcon className="w-16 h-16 text-red-500 mb-4" />
                        <h3 className="text-xl font-semibold">Camera Error</h3>
                        <p className="text-gray-400 max-w-sm">{error}</p>
                    </div>
                ) : (
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        muted 
                        playsInline 
                        className={`w-full h-full object-cover transform scale-x-[-1] cursor-pointer ${!isCameraOn && 'hidden'}`}
                        onDoubleClick={toggleFullscreen}
                        title="Double click for fullscreen"
                    ></video>
                )}
                {!isCameraOn && !error && (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                         <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-5xl font-bold">You</div>
                    </div>
                )}
            </div>
            
            <header className="absolute top-0 left-0 right-0 p-4 text-center z-10 bg-gradient-to-b from-black/50 to-transparent">
                <h1 className="text-xl font-bold">Group Project: Compost Heroes</h1>
            </header>

            {/* Thumbnails of other participants */}
            <div className={`absolute top-4 right-4 z-10 space-y-4 ${isFullscreen ? 'scale-125 origin-top-right' : ''}`}>
                {mockParticipants.map(p => (
                    <div key={p.name} className="w-48 h-32 bg-gray-800 rounded-lg flex items-center justify-center relative border-2 border-gray-700 overflow-hidden shadow-lg">
                        <img src={p.avatar} alt={p.name} className="w-16 h-16 rounded-full" />
                        <div className="absolute bottom-1 left-1 bg-black/50 px-2 py-0.5 rounded text-xs">{p.name}</div>
                    </div>
                ))}
            </div>
            
            {/* Controls */}
            <footer className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 backdrop-blur-sm z-10">
                <div className="flex items-center justify-center gap-6">
                    <div className="flex flex-col items-center gap-1">
                        <button onClick={toggleMic} className={`p-4 rounded-full transition-colors ${isMicOn ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-500'}`} aria-label={isMicOn ? 'Mute microphone' : 'Unmute microphone'}>
                            {isMicOn ? <MicrophoneIcon className="h-6 w-6" /> : <MicrophoneSlashIcon className="h-6 w-6" />}
                        </button>
                        <span className="text-xs">{isMicOn ? 'Mute' : 'Unmute'}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <button onClick={toggleCamera} className={`p-4 rounded-full transition-colors ${isCameraOn ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-500'}`} aria-label={isCameraOn ? 'Turn off camera' : 'Turn on camera'}>
                            {isCameraOn ? <VideoCameraIcon className="h-6 w-6" /> : <VideoCameraSlashIcon className="h-6 w-6" />}
                        </button>
                        <span className="text-xs">{isCameraOn ? 'Stop Video' : 'Start Video'}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <button onClick={toggleFullscreen} className="p-4 rounded-full bg-gray-600 hover:bg-gray-500 transition-colors" aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
                            {isFullscreen ? <ArrowsPointingInIcon className="h-6 w-6" /> : <ArrowsPointingOutIcon className="h-6 w-6" />}
                        </button>
                        <span className="text-xs">{isFullscreen ? 'Exit Full' : 'Fullscreen'}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <button onClick={handleHangUp} className="p-4 rounded-full bg-red-600 hover:bg-red-500 transition-colors" aria-label="Hang up">
                            <PhoneXMarkIcon className="h-6 w-6" />
                        </button>
                        <span className="text-xs text-red-400">End Call</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default GroupVideoCall;
