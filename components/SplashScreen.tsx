import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface SplashScreenProps {
    onEnter: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
    const { t } = useTranslation();
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                onEnter();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [onEnter]);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 text-white overflow-hidden">
            {/* Animated Background Elements */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, -90, 0],
                    opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-20 -right-20 w-[30rem] h-[30rem] bg-emerald-300/10 rounded-full blur-3xl"
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center z-10"
            >
                {/* Logo Section */}
                <motion.div 
                    animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="mb-8 flex justify-center"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-150" />
                        <svg 
                            viewBox="0 0 100 100" 
                            className="w-40 h-40 drop-shadow-2xl"
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="50" cy="50" r="45" fill="white" fillOpacity="0.1" stroke="white" strokeWidth="2" />
                            <path 
                                d="M50 20C50 20 30 40 30 60C30 71.0457 38.9543 80 50 80C61.0457 80 70 71.0457 70 60C70 40 50 20 50 20Z" 
                                fill="#4ADE80" 
                            />
                            <path 
                                d="M50 20C50 20 65 35 65 50C65 58.2843 58.2843 65 50 65C41.7157 65 35 58.2843 35 50C35 35 50 20 50 20Z" 
                                fill="#2DD4BF" 
                            />
                            <path 
                                d="M50 30L55 45H70L58 55L63 70L50 60L37 70L42 55L30 45H45L50 30Z" 
                                fill="white" 
                            />
                        </svg>
                    </div>
                </motion.div>

                <h1 className="text-6xl font-black tracking-tighter mb-2 drop-shadow-lg">
                    {t('eco_champs')}
                </h1>
                <p className="text-xl font-medium text-emerald-100 mb-12 tracking-wide">
                    {t('gamified_challenges')}
                </p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="flex flex-col items-center gap-6"
                >
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onEnter}
                        className="group relative px-12 py-5 bg-white text-emerald-700 font-black text-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            {t('enter')}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                        <motion.div 
                            className="absolute inset-0 bg-emerald-50"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: 0 }}
                            transition={{ type: 'tween' }}
                        />
                    </motion.button>
                    
                    <div className="flex items-center gap-2 text-white/80 font-medium">
                        <kbd className="px-2 py-1 bg-white/20 rounded border border-white/30 text-xs">ENTER</kbd>
                        <span className="text-sm uppercase tracking-widest">{t('press_key')}</span>
                    </div>
                </motion.div>
            </motion.div>

            {/* Bottom Info */}
            <div className="absolute bottom-8 left-0 right-0 text-center text-white/40 text-xs font-mono tracking-widest uppercase">
                {t('protecting_planet')}
            </div>
        </div>
    );
};

export default SplashScreen;
