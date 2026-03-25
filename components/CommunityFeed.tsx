import React, { useState, useRef, useEffect } from 'react';
import type { CommunityMessage, User } from '../types';

interface CommunityFeedViewProps {
    feed: CommunityMessage[];
    currentUser: User;
    onSendMessage: (messageText: string) => void;
    onBackToHub: () => void;
}

const TimeAgo: React.FC<{ date: string }> = ({ date }) => {
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return <span>{Math.floor(interval)}y ago</span>;
    interval = seconds / 2592000;
    if (interval > 1) return <span>{Math.floor(interval)}mo ago</span>;
    interval = seconds / 86400;
    if (interval > 1) return <span>{Math.floor(interval)}d ago</span>;
    interval = seconds / 3600;
    if (interval > 1) return <span>{Math.floor(interval)}h ago</span>;
    interval = seconds / 60;
    if (interval > 1) return <span>{Math.floor(interval)}m ago</span>;
    return <span>{Math.floor(seconds)}s ago</span>;
}


const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({ feed, currentUser, onSendMessage, onBackToHub }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [feed]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        onSendMessage(newMessage);
        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)] max-w-3xl mx-auto bg-surface rounded-2xl shadow-2xl overflow-hidden">
             <header className="p-4 border-b dark:border-gray-700 flex items-center relative">
                <button onClick={onBackToHub} className="absolute left-4 p-2 rounded-full hover:bg-background transition-colors text-text-secondary hover:text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <div className="flex-1 text-center">
                    <h1 className="text-xl font-bold text-text-primary">Community Feed</h1>
                    <p className="text-sm text-text-secondary">Share tips and cheer on fellow EcoChamps!</p>
                </div>
            </header>

            <main className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-6">
                    {feed.map((item) => (
                        <div key={item.id} className={`flex items-start gap-3 ${item.userId === currentUser.id ? 'flex-row-reverse' : ''}`}>
                            <img src={item.userAvatar} alt={item.userName} className="w-10 h-10 rounded-full border-2 border-primary" />
                            <div className="flex flex-col">
                                <div className={`flex items-baseline gap-2 ${item.userId === currentUser.id ? 'flex-row-reverse' : ''}`}>
                                    <span className="font-bold text-sm text-text-primary">{item.userName}</span>
                                    <span className="text-xs text-text-secondary"><TimeAgo date={item.timestamp} /></span>
                                </div>
                                <div className={`mt-1 p-3 rounded-2xl text-sm ${item.userId === currentUser.id ? 'bg-primary text-white rounded-br-none' : 'bg-background rounded-bl-none'}`}>
                                    <p>{item.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            
            <footer className="p-4 border-t dark:border-gray-700 bg-background/50">
                 <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <img src={currentUser.avatar} alt="You" className="w-10 h-10 rounded-full" />
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Share an update..."
                        className="w-full px-4 py-3 bg-surface border-2 border-transparent focus:border-primary rounded-full text-text-primary focus:outline-none transition"
                    />
                    <button type="submit" disabled={!newMessage.trim()} className="bg-primary text-white font-bold p-3 rounded-full hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default CommunityFeedView;