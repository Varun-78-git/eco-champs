import React, { useEffect } from 'react';
import { LeafIcon } from './icons';
import { motion } from 'motion/react';

interface LandingProps {
    onEnter: () => void;
}

const Landing: React.FC<LandingProps> = ({ onEnter }) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                onEnter();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onEnter]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-emerald-950 p-4 overflow-hidden relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-center z-10"
            >
                <motion.div 
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    className="mb-10 flex justify-center"
                >
                    <div className="p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border-4 border-emerald-500/20 relative group">
                        <div className="absolute inset-0 bg-emerald-500/5 rounded-[2.5rem] scale-110 blur-xl group-hover:bg-emerald-500/10 transition-all" />
                        <LeafIcon className="w-32 h-32 text-emerald-600 dark:text-emerald-400 relative z-10" />
                    </div>
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-gray-900 dark:text-white mb-6 uppercase">
                        Eco<span className="text-emerald-600">Champs</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-16 font-medium max-w-2xl mx-auto leading-relaxed">
                        Join the movement. Complete challenges, earn rewards, and become a champion for our planet.
                    </p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onEnter}
                            className="group px-16 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-xl shadow-2xl transition-all flex items-center gap-4 relative overflow-hidden"
                        >
                            <span className="relative z-10">Get Started</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-white/20 to-emerald-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        </motion.button>
                        
                        <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500 font-semibold animate-bounce">
                            <span className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded-lg text-sm border border-gray-300 dark:border-gray-700 shadow-sm">ENTER</span>
                            <span className="text-sm uppercase tracking-widest">to continue</span>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
            
            <div className="absolute bottom-12 left-0 w-full flex justify-center gap-8 text-gray-400 dark:text-gray-600 text-xs font-bold uppercase tracking-[0.3em]">
                <span>Sustainability</span>
                <span className="w-1 h-1 bg-emerald-500 rounded-full self-center" />
                <span>Gamification</span>
                <span className="w-1 h-1 bg-emerald-500 rounded-full self-center" />
                <span>Community</span>
            </div>
        </div>
    );
};

export default Landing;
