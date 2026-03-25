import React, { useState, useEffect, useRef } from 'react';
import type { ChatbotMessage, User, LearningModule } from '../types';
import { getChatbotResponse } from '../services/geminiService';
import { ChatBubbleOvalLeftEllipsisIcon, BookOpenIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon } from './icons';
import { LEARNING_MODULES_DATA } from '../constants';
import {
    WaterCycleAnimation,
    DecomposerAnimation,
    PollinatorAnimation,
    PlasticPollutionAnimation,
    RenewableEnergyAnimation,
    CompostingAnimation,
    AirPollutionAnimation,
    WildlifeAnimation
} from './animations';


interface LearnViewProps {
    currentUser: User;
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<ChatbotMessage[]>([
        { sender: 'bot', text: 'Hello! I\'m EcoBot. 🌿 Ask me anything about the environment or sustainability!' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage: ChatbotMessage = { sender: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const botResponseText = await getChatbotResponse(inputValue);
            const botMessage: ChatbotMessage = { sender: 'bot', text: botResponseText };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: ChatbotMessage = { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <main className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-6">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">🌿</div>}
                            <div className={`max-w-md p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-background rounded-bl-none'}`}>
                                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3">
                           <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">🌿</div>
                            <div className="max-w-md p-4 rounded-2xl bg-background rounded-bl-none flex items-center gap-2">
                               <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                               <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                               <span className="h-2 w-2 bg-primary rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            <footer className="p-4 border-t dark:border-gray-700 bg-background/50">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask about saving water..."
                        className="w-full px-4 py-3 bg-surface border-2 border-transparent focus:border-primary rounded-lg text-text-primary focus:outline-none transition"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !inputValue.trim()} className="bg-primary text-white font-bold p-3 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.894a1 1 0 011.414 0l4.243 4.242a1 1 0 11-1.415 1.415L13 6.414V14.5a1 1 0 11-2 0V6.414l-2.121 2.121a1 1 0 01-1.414-1.414l4.242-4.242z" />
                        </svg>
                    </button>
                </form>
            </footer>
        </div>
    );
};

const TopicsHub: React.FC<{ onSelectModule: (module: LearningModule) => void }> = ({ onSelectModule }) => {
    return (
        <div className="p-8 h-full overflow-y-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-text-primary">Learning Hub</h2>
                <p className="text-text-secondary">Explore topics and watch videos to become an EcoChamp!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {LEARNING_MODULES_DATA.map(module => {
                    return (
                        <div 
                            key={module.id}
                            onClick={() => onSelectModule(module)}
                            className="bg-background p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer flex items-center gap-4 transform hover:-translate-y-1"
                        >
                            <div className="text-4xl">{module.icon}</div>
                            <div>
                                <h3 className="font-bold text-lg text-black dark:text-text-primary">{module.title}</h3>
                                <p className="text-sm text-gray-700 dark:text-text-secondary">{module.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const animationMap: { [key: string]: React.FC } = {
    'learn-1': WaterCycleAnimation,
    'learn-2': DecomposerAnimation,
    'learn-3': PollinatorAnimation,
    'learn-4': PlasticPollutionAnimation,
    'learn-5': RenewableEnergyAnimation,
    'learn-6': CompostingAnimation,
    'learn-7': AirPollutionAnimation,
    'learn-8': WildlifeAnimation,
};

const formatBold = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-text-primary">$1</strong>');
}

const FormattedContent: React.FC<{ content: string }> = ({ content }) => {
    const sections = content.split('\n\n');

    return (
        <div className="space-y-4">
            {sections.map((section, index) => {
                // Check for headings (e.g., "Key Stages:")
                if (section.match(/^.+:$/m)) {
                    return <h3 key={index} className="text-xl font-bold text-primary mt-6 mb-2">{section}</h3>;
                }
                
                // Check for lists (start with "1." or "- ")
                if (section.match(/^\d\.\s/m) || section.match(/^- /m)) {
                    const listItems = section.split('\n').filter(line => line.trim());
                    
                    return (
                        <ul key={index} className="space-y-3 list-none p-0">
                            {listItems.map((item, itemIndex) => {
                                const cleanItem = item.replace(/^\d\.\s*|- \s*/, '');
                                return (
                                    <li key={itemIndex} className="bg-gradient-to-r from-green-50/50 to-background dark:from-green-900/10 dark:to-gray-800 p-4 rounded-lg flex items-start gap-4 border-l-4 border-primary shadow-sm">
                                        <div className="flex-shrink-0 text-primary mt-1 bg-primary/10 p-1 rounded-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <p className="m-0 text-text-secondary" dangerouslySetInnerHTML={{ __html: formatBold(cleanItem) }} />
                                    </li>
                                );
                            })}
                        </ul>
                    );
                }
                
                // Default to a paragraph
                return <p key={index} className="text-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: formatBold(section) }} />;
            })}
        </div>
    );
};


const TopicDetail: React.FC<{ module: LearningModule; onBack: () => void }> = ({ module, onBack }) => {
    const AnimationComponent = animationMap[module.id] || null;
    const [isFullscreen, setIsFullscreen] = useState(false);
    const videoContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!videoContainerRef.current) return;
        if (!document.fullscreenElement) {
            videoContainerRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className="h-full overflow-y-auto">
            <div className="p-6 md:p-8">
                <button onClick={onBack} className="flex items-center gap-2 text-primary font-semibold mb-6 hover:underline">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Topics
                </button>
                <h1 className="text-4xl font-bold text-text-primary mb-4 flex items-center gap-4">
                    <span className="text-5xl">{module.icon}</span>
                    {module.title}
                </h1>
                <div 
                    ref={videoContainerRef}
                    onDoubleClick={toggleFullscreen}
                    title="Double click for fullscreen"
                    className={`relative aspect-video mb-8 rounded-lg overflow-hidden shadow-lg bg-blue-50 dark:bg-gray-800 p-2 md:p-4 border dark:border-gray-700 cursor-pointer ${isFullscreen ? 'flex items-center justify-center bg-black' : ''}`}
                >
                    {AnimationComponent && <AnimationComponent />}
                    <button 
                        onClick={toggleFullscreen}
                        className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-20"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                        {isFullscreen ? <ArrowsPointingInIcon className="h-5 w-5" /> : <ArrowsPointingOutIcon className="h-5 w-5" />}
                    </button>
                </div>
                <FormattedContent content={module.content} />
            </div>
        </div>
    );
};

const LearnView: React.FC<LearnViewProps> = ({ currentUser }) => {
    const [activeTab, setActiveTab] = useState<'topics' | 'chatbot'>('topics');
    const [learnView, setLearnView] = useState<'hub' | 'module'>('hub');
    const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
    
    const handleSelectModule = (module: LearningModule) => {
        setSelectedModule(module);
        setLearnView('module');
    };

    const handleBackToHub = () => {
        setSelectedModule(null);
        setLearnView('hub');
    };

    const TabButton: React.FC<{
        tabId: 'topics' | 'chatbot';
        icon: React.ReactElement;
        text: string;
    }> = ({ tabId, icon, text }) => {
        const isActive = activeTab === tabId;
        return (
            <button
                onClick={() => setActiveTab(tabId)}
                className={`flex-1 flex items-center justify-center gap-2 p-4 font-semibold transition-colors relative ${
                    isActive
                        ? 'text-primary border-b-2 border-primary bg-primary/5'
                        : 'text-text-secondary hover:text-text-primary hover:bg-background'
                }`}
            >
                {icon}
                <span>{text}</span>
            </button>
        );
    };

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto bg-surface rounded-2xl shadow-2xl overflow-hidden">
            <header className="border-b dark:border-gray-700 flex items-center">
                <TabButton tabId="topics" icon={<BookOpenIcon />} text="Topics" />
                <TabButton tabId="chatbot" icon={<ChatBubbleOvalLeftEllipsisIcon />} text="EcoBot AI" />
            </header>
            
            <div className="flex-1 overflow-hidden">
                {activeTab === 'topics' && (
                    learnView === 'hub' 
                        ? <TopicsHub onSelectModule={handleSelectModule} />
                        : <TopicDetail module={selectedModule!} onBack={handleBackToHub} />
                )}
                {activeTab === 'chatbot' && <Chatbot />}
            </div>
        </div>
    );
};

export default LearnView;
