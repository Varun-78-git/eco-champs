
import React, { useState, useEffect, useCallback } from 'react';
import type { Challenge } from '../types';
import { generatePersonalizedChallenges } from '../services/geminiService';
import { INTEREST_CATEGORIES } from '../constants';
// fix: SparklesIcon is not exported from '../constants'. It is in './icons'.
import { BoltIcon, LeafIcon, RecycleIcon, WaterDropIcon } from '../constants';
import { SparklesIcon } from './icons';
import ChallengeCard from './ChallengeCard';

interface PersonalizedSuggestionsProps {
    onChallengeSelect: (challenge: Challenge) => void;
    completedChallengeIds: string[];
}

// fix: Use React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
const categoryIcons: { [key: string]: React.ReactElement } = {
    'Waste Management': <RecycleIcon />,
    'Water Conservation': <WaterDropIcon />,
    'Biodiversity': <LeafIcon />,
    'Energy Conservation': <BoltIcon />,
    'Climate Action': <SparklesIcon />,
};

const PersonalizedSuggestions: React.FC<PersonalizedSuggestionsProps> = ({ onChallengeSelect, completedChallengeIds }) => {
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [suggestedChallenges, setSuggestedChallenges] = useState<Challenge[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInterestToggle = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
        );
    };

    const fetchSuggestions = useCallback(async () => {
        if (selectedInterests.length === 0) {
            setSuggestedChallenges([]);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const rawChallenges = await generatePersonalizedChallenges(selectedInterests);
            const challengesWithDetails: Challenge[] = rawChallenges.map((c, index) => ({
                ...c,
                id: `gemini-${Date.now()}-${index}`,
                icon: categoryIcons[c.category] || <SparklesIcon />,
            }));
            setSuggestedChallenges(challengesWithDetails);
        } catch (e) {
            setError('Failed to fetch suggestions. Please try again.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [selectedInterests]);

    useEffect(() => {
        if (selectedInterests.length > 0) {
            const timer = setTimeout(() => {
                fetchSuggestions();
            }, 500); // Debounce API call
            return () => clearTimeout(timer);
        }
    }, [selectedInterests, fetchSuggestions]);


    return (
        <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 p-6 rounded-2xl shadow-md">
            <div className="flex items-center gap-2 mb-4">
                <SparklesIcon />
                <h2 className="text-2xl font-bold text-text-primary">Personalized Challenges</h2>
            </div>
            <p className="text-text-secondary mb-4">Select your interests to get AI-powered challenge suggestions!</p>

            <div className="flex flex-wrap gap-2 mb-6">
                {INTEREST_CATEGORIES.map(interest => (
                    <button
                        key={interest}
                        onClick={() => handleInterestToggle(interest)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${selectedInterests.includes(interest) ? 'bg-primary text-white' : 'bg-white dark:bg-surface text-gray-700 dark:text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        {interest}
                    </button>
                ))}
            </div>

            {isLoading && (
                 <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                 </div>
            )}
            {error && <p className="text-red-500 dark:text-red-400 text-center">{error}</p>}
            
            {!isLoading && suggestedChallenges.length > 0 && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestedChallenges.map(challenge => (
                        <ChallengeCard
                            key={challenge.id}
                            challenge={challenge}
                            onSelect={onChallengeSelect}
                            isCompleted={completedChallengeIds.includes(challenge.id)}
                        />
                    ))}
                 </div>
            )}
            {!isLoading && suggestedChallenges.length === 0 && selectedInterests.length > 0 && (
                <div className="text-center p-6 bg-white/50 dark:bg-surface/50 rounded-lg">
                    <p className="text-text-secondary">No suggestions generated yet. Try selecting more interests!</p>
                </div>
            )}
        </div>
    );
};

export default PersonalizedSuggestions;