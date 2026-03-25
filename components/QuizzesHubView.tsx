import React from 'react';

interface QuizzesHubViewProps {
  onStartQuiz: (topic: string) => void;
}

const QuizCard: React.FC<{ topic: string; emoji: string; onClick: () => void; }> = ({ topic, emoji, onClick }) => (
    <div 
        onClick={onClick} 
        className="p-6 bg-surface rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col items-center justify-center text-center transform hover:-translate-y-1"
    >
        <span className="text-5xl mb-3">{emoji}</span>
        <h3 className="font-bold text-lg text-text-primary">{topic}</h3>
        <p className="text-sm text-text-secondary mt-1">Test your knowledge!</p>
    </div>
);


const QuizzesHubView: React.FC<QuizzesHubViewProps> = ({ onStartQuiz }) => {
  return (
    <div className="bg-surface p-8 rounded-2xl shadow-xl max-w-4xl mx-auto">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text-primary">Test Your Knowledge</h2>
            <p className="text-text-secondary">Choose a topic and see how much you know to earn points!</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuizCard 
                topic="Waste Management" 
                emoji="🗑️" 
                onClick={() => onStartQuiz('Waste Management')} 
            />
            <QuizCard 
                topic="Water Conservation" 
                emoji="💧" 
                onClick={() => onStartQuiz('Water Conservation')} 
            />
            <QuizCard 
                topic="Climate Change in India" 
                emoji="☀️" 
                onClick={() => onStartQuiz('Climate Change in India')} 
            />
             <QuizCard 
                topic="Biodiversity" 
                emoji="🌳" 
                onClick={() => onStartQuiz('Biodiversity in India')} 
            />
             <QuizCard 
                topic="Energy Saving" 
                emoji="💡" 
                onClick={() => onStartQuiz('Energy Saving at Home')} 
            />
             <QuizCard 
                topic="Sustainable Living" 
                emoji="♻️" 
                onClick={() => onStartQuiz('Sustainable Living')} 
            />
        </div>
    </div>
  );
};

export default QuizzesHubView;
