

import React, { useMemo } from 'react';
import { AppView } from '../types';

// SVG Icon Components
const LeafIcon = () => (<svg viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1.95-4.22C9.28 13 17 11 17 8m1.15-6.26C16.42 2.3 14.2 2.73 13 4c-1.87 2-1.25 4.88 1 6.25S18.13 11.5 20 9.5c1.25-1.87.82-4.09-.73-5.82Z"></path></svg>);
const PlasticBottleIcon = () => (<svg viewBox="0 0 24 24"><path d="M16 9h-2v10h2c1.1 0 2-.9 2-2V11c0-1.1-.9-2-2-2m-4 10V9H8c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h4M15 5H9c-.55 0-1 .45-1 1s.45 1 1 1h6c.55 0 1-.45 1-1s-.45-1-1-1m-1 16H8c-2.21 0-4-1.79-4-4V11c0-2.21 1.79-4 4-4h8c2.21 0 4 1.79 4 4v6c0 2.21-1.79 4-4 4Z"></path></svg>);
const PlasticBagIcon = () => (<svg viewBox="0 0 24 24"><path d="M16.5 13c-1.21 0-2.27.66-2.82 1.64c-.1.18-.04.42.14.52l.4.22c.18.1.42.04.52-.14c.36-.67 1.05-1.1 1.8-1.1c1.1 0 2 .9 2 2c0 .75-.41 1.4-1.03 1.75l1.03.56c1.1-.64 1.8-1.8 1.8-3.1c0-1.93-1.57-3.5-3.5-3.5M6 13c-1.93 0-3.5 1.57-3.5 3.5c0 1.3.7 2.46 1.8 3.1l1.03-.56C4.41 18.4 4 17.75 4 17c0-1.1.9-2 2-2c.75 0 1.44.43 1.8 1.1c.1.18.34.24.52.14l.4-.22c.18-.1.24-.34.14-.52C8.27 13.66 7.21 13 6 13m7.5-11C12.67 2 12 2.67 12 3.5V5H8.5C7.67 5 7 5.67 7 6.5V9h10V6.5C17 5.67 16.33 5 15.5 5H12V3.5c0-.83-.67-1.5-1.5-1.5Z"></path></svg>);
const GoldLeafIcon = () => (<svg viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1.95-4.22C9.28 13 17 11 17 8m1.15-6.26C16.42 2.3 14.2 2.73 13 4c-1.87 2-1.25 4.88 1 6.25S18.13 11.5 20 9.5c1.25-1.87.82-4.09-.73-5.82Z"></path></svg>);
const SparkleIcon = () => (<svg viewBox="0 0 24 24"><path d="m12 0l2.9 8.1L24 11l-8.3 4.4L12 24l-3.7-8.6L0 15l8.1-2.9L11 0h1Z"></path></svg>);
const LightbulbIcon = () => (<svg viewBox="0 0 24 24"><path d="M12 2A7 7 0 0 0 5 9c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74A7 7 0 0 0 12 2m-2 17v2h4v-2Z"></path></svg>);
const QuestionMarkIcon = () => (<svg viewBox="0 0 24 24"><path d="M15.07 11.25L14.17 12.17c-1.35 1.35-1.35 3.54 0 4.89l.9 1.43c.9 1.43 2.77 1.83 4.2 1.03l-3.1-4.8c-.8-1.26-1.57-2.73-1.1-4.34M10 18c-3.31 0-6-2.69-6-6s2.69-6 6-6s6 2.69 6 6s-2.69 6-6 6m0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4s-1.79-4-4-4Z"></path></svg>);
const CircuitIcon = () => (<svg viewBox="0 0 24 24"><path d="M22 13h-4v-2h4m-6 2v-2h-4v-4h-2V7h-2v2h4v4h-2v2h-2v-2H8V9H6v4H2v-2h4V9h2V7h2v2h4v4h2v2h2v-2h-2v-2h-2v2h-2v2Z"></path></svg>);
const ChatBubbleIcon = () => (<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2Z"></path></svg>);
const AppleIcon = () => (<svg viewBox="0 0 24 24"><path d="M19 12.3a4.7 4.7 0 0 1-1.5 3.5c-.8.8-1.7 1.2-2.9 1.2s-2.1-.4-2.9-1.2c-1.6-1.6-2.5-3.8-2.5-6.1c0-2.3 1-4.5 2.5-6.1c.8-.8 1.7-1.2 2.9-1.2s2.1.4 2.8 1.2a4.5 4.5 0 0 1 1.6 3.5c0 .3-.1.5-.1.8c0 .2 0 .4.1.6h-1.8c-.2-1.2-1.2-2.1-2.6-2.1c-1.4 0-2.5 1-2.5 2.2c0 1.2 1.1 2.2 2.5 2.2c1.4 0 2.4-1 2.6-2.1h1.8c-.1.2-.1.4-.1.6c0 .3 0 .5.1.8m-2.8-5.6c-.4 0-.8.1-1.1.4s-.4.6-.4 1s.1.8.4 1s.6.4 1 .4c.5 0 .8-.1 1.1-.4s.4-.6.4-1s-.2-.8-.4-1s-.6-.4-1.1-.4Z"></path></svg>);
const CheckmarkIcon = () => (<svg viewBox="0 0 24 24"><path d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59L21 7Z"></path></svg>);
const SunIcon = () => (<svg viewBox="0 0 24 24"><path d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L9.8,4.2L12,6.4L14.2,4.2L12,2M18.4,5.6L19.8,4.2L22,6.4L20.6,7.8L18.4,5.6M4.2,19.8L2,22L4.2,22L6.4,19.8L4.2,18.4L4.2,19.8M4.2,4.2L6.4,2L7.8,3.4L5.6,5.6L4.2,4.2M22,12L19.8,9.8L17.6,12L19.8,14.2L22,12M3.4,16.2L2,17.6L2,19.8L4.2,19.8L5.6,18.4L3.4,16.2M22,16.2L18.4,16.2L16.2,18.4L18.4,20.6L22,19.8V17.6L22,16.2Z" /></svg>);
const CloudIcon = () => (<svg viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5c0-2.64-2.05-4.78-4.65-4.96Z"></path></svg>);
const FishIcon = () => (<svg viewBox="0 0 24 24"><path d="M17.45,14.18C17.72,13.5 18,12.78 18,12C18,9.79 16.21,8 14,8C11.79,8 10,9.79 10,12C10,14.21 11.79,16 14,16C15.28,16 16.4,15.29 17.06,14.32L22,18V6L17.45,14.18Z"></path></svg>);
const CrushedCanIcon = () => (<svg viewBox="0 0 24 24"><path d="M7 2H17V6H7V2M5 7H19L17.5 20H6.5L5 7M9 8L10 18M15 8L14 18"></path></svg>);
const UserGroupIcon = () => (<svg viewBox="0 0 24 24"><path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M12,14.5C14.67,14.5 20,15.84 20,18.5V20H4V18.5C4,15.84 9.33,14.5 12,14.5Z" /></svg>);


interface AnimatedItemProps {
    children: React.ReactNode;
    color: string;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({ children, color }) => {
    const style: React.CSSProperties = {
        left: `${Math.random() * 100}vw`,
        animationDuration: `${20 + Math.random() * 20}s`,
        animationDelay: `${Math.random() * 15}s`,
        transform: `scale(${0.5 + Math.random() * 0.7})`,
        color: color,
    };
    return <div className="animated-item" style={style}>{children}</div>;
}

const createItems = (icons: { icon: React.FC, color: string }[], count: number) => {
    return Array.from({ length: count }).map((_, i) => {
        const { icon: Icon, color } = icons[i % icons.length];
        return <AnimatedItem key={i} color={color}><Icon /></AnimatedItem>;
    });
};

const iconSets = {
    ECOSYSTEM: [
        { icon: LeafIcon, color: 'var(--radium-leaf-color)' },
        { icon: PlasticBottleIcon, color: 'var(--radium-plastic-color)' },
        { icon: PlasticBagIcon, color: 'var(--radium-plastic-color)' },
        { icon: CrushedCanIcon, color: 'var(--radium-plastic-color)' },
        { icon: SunIcon, color: 'var(--radium-sun-color)' },
        { icon: CloudIcon, color: 'var(--radium-cloud-color)' },
        { icon: FishIcon, color: 'var(--radium-water-color)' },
    ],
    LEADERBOARD: [{ icon: GoldLeafIcon, color: 'var(--gold-leaf-color)' }, { icon: SparkleIcon, color: 'var(--gold-leaf-color)' }],
    QUIZZES: [{ icon: LightbulbIcon, color: 'var(--quiz-color)' }, { icon: QuestionMarkIcon, color: 'var(--quiz-color)' }],
    CHATBOT: [{ icon: LeafIcon, color: 'var(--leaf-color)' }, { icon: CircuitIcon, color: 'var(--leaf-color)' }],
    COMMUNITY: [{ icon: ChatBubbleIcon, color: 'var(--leaf-color)' }, { icon: UserGroupIcon, color: 'var(--leaf-color)' }],
    TEACHER: [{ icon: AppleIcon, color: 'var(--teacher-color)' }, { icon: CheckmarkIcon, color: 'var(--teacher-color)' }],
};

interface DynamicBackgroundProps {
    currentView: AppView | 'LOGIN' | 'LANDING';
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ currentView }) => {
    
    const items = useMemo(() => {
        let selectedIcons: { icon: React.FC, color: string }[] = iconSets.ECOSYSTEM;
        let count = 20;
        switch (currentView) {
            case 'LANDING':
                selectedIcons = iconSets.ECOSYSTEM;
                count = 40; // More items for a lush landing feel
                break;
            case 'LOGIN':
            case AppView.CHALLENGES:
            case AppView.ECOSYSTEM_DONTS:
                selectedIcons = iconSets.ECOSYSTEM;
                count = 25;
                break;
            case AppView.LEADERBOARD:
                selectedIcons = iconSets.LEADERBOARD;
                count = 15;
                break;
            case AppView.QUIZZES_HUB:
            case AppView.QUIZ_IN_PROGRESS:
                selectedIcons = iconSets.QUIZZES;
                count = 15;
                break;
            case AppView.CHATBOT:
                selectedIcons = iconSets.CHATBOT;
                count = 15;
                break;
            case AppView.COMMUNITY_HUB:
            case AppView.COMMUNITY_FEED:
                selectedIcons = iconSets.COMMUNITY;
                count = 15;
                break;
            case AppView.TEACHER_DASHBOARD:
            case AppView.TEACHER_REVIEW:
            case AppView.ASSIGNMENTS:
                selectedIcons = iconSets.TEACHER;
                count = 15;
                break;
        }
        return createItems(selectedIcons, count);
    }, [currentView]);

    return (
        <div className="dynamic-background-container" aria-hidden="true">
            {items}
        </div>
    );
};

export default DynamicBackground;
