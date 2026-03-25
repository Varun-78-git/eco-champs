
import React from 'react';
import { AppView, type User } from '../types';
import { ChartBarIcon, DocumentTextIcon, AcademicCapIcon, ClipboardListIcon, LogoutIcon, SunIcon, MoonIcon, GlobeAltIcon, UsersIcon, ChatBubbleOvalLeftEllipsisIcon, ClipboardDocumentCheckIcon, Squares2X2Icon, LockClosedIcon, NoSymbolIcon, BookOpenIcon, TrophyIcon, PuzzlePieceIcon } from './icons';

interface HeaderProps {
  currentUser: User;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, activeView, setActiveView, onLogout, theme, toggleTheme }) => {
  const NavButton: React.FC<{ view: AppView; icon: React.ReactElement; text: string; isLocked?: boolean; lockedText?: string }> = ({ view, icon, text, isLocked = false, lockedText }) => {
    const isActive = activeView === view;
    const isDisabled = isLocked;

    const buttonClasses = `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors relative ${
      isActive ? 'bg-primary text-white' : 
      isDisabled ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' : 
      'text-text-secondary hover:bg-primary/10 hover:text-primary'
    }`;
    
    return (
        <div className="relative group">
            <button
              onClick={() => !isDisabled && setActiveView(view)}
              className={buttonClasses}
              disabled={isDisabled}
              aria-label={text}
            >
              {isLocked && <LockClosedIcon className="h-4 w-4 absolute -top-1 -left-1 text-yellow-500" />}
              {icon}
              <span className="hidden sm:inline">{text}</span>
            </button>
            {isLocked && lockedText && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                    {lockedText}
                </div>
            )}
        </div>
    );
};

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Welcome */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
                <span className="text-3xl">🌿</span>
                <h1 className="text-2xl font-bold text-text-primary hidden lg:block">EcoChamps</h1>
            </div>
             <div className="hidden sm:block border-l border-gray-200 dark:border-gray-700 pl-4">
                <div className="text-md font-bold text-text-primary">Welcome, {currentUser.name}!</div>
                {currentUser.role === 'student' && <div className="text-sm text-secondary -mt-1">{currentUser.points} Eco-Points</div>}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-background p-1 rounded-full">
            {currentUser.role === 'student' ? (
                <>
                    <NavButton view={AppView.CHALLENGES} icon={<DocumentTextIcon />} text="Challenges" />
                    <NavButton view={AppView.QUIZZES_HUB} icon={<AcademicCapIcon />} text="Quizzes" />
                    <NavButton 
                        view={AppView.CHATBOT} 
                        icon={<BookOpenIcon />} 
                        text="Learn" 
                    />
                    <NavButton view={AppView.ASSIGNMENTS} icon={<ClipboardListIcon />} text="Assignments" />
                    <NavButton view={AppView.ECOSYSTEM_DONTS} icon={<NoSymbolIcon />} text="Eco Don'ts" />
                    <NavButton view={AppView.FUN_GAMES} icon={<PuzzlePieceIcon />} text="Fun Games" />
                    <NavButton 
                        view={AppView.COMMUNITY_HUB} 
                        icon={<UsersIcon />} 
                        text="Community" 
                    />
                    <NavButton view={AppView.REWARDS_STORE} icon={<TrophyIcon />} text="Rewards" />
                </>
            ) : (
                <>
                    <NavButton view={AppView.TEACHER_DASHBOARD} icon={<Squares2X2Icon />} text="Dashboard" />
                    <NavButton view={AppView.TEACHER_REVIEW} icon={<ClipboardDocumentCheckIcon />} text="Review" />
                    <NavButton view={AppView.ASSIGNMENTS} icon={<ClipboardListIcon />} text="Assignments" />
                </>
            )}
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center space-x-2">
             <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-background text-text-secondary hover:text-primary">
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
             </button>
             <button className="p-2 rounded-full hover:bg-background text-text-secondary hover:text-primary">
                <GlobeAltIcon />
             </button>
            <button onClick={onLogout} className="flex items-center space-x-2 p-2 rounded-full hover:bg-background text-text-secondary hover:text-red-500">
                <LogoutIcon />
            </button>
            <button onClick={() => setActiveView(AppView.PROFILE)} aria-label="View Profile">
                 <img 
                  className="h-12 w-12 rounded-full object-cover border-2 border-primary cursor-pointer hover:border-primary-dark transition"
                  src={currentUser.avatar} 
                  alt={currentUser.name}
                />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
