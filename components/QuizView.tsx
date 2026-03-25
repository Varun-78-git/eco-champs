
import React, { useState, useEffect, useCallback } from 'react';
import { generateQuiz } from '../services/geminiService';
import type { QuizQuestion } from '../types';

interface QuizViewProps {
  topic: string;
  onQuizComplete: (score: number) => void;
  onBack: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ topic, onQuizComplete, onBack }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    const fetchedQuestions = await generateQuiz(topic);
    setQuestions(fetchedQuestions);
    setIsLoading(false);
  }, [topic]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
    setShowFeedback(true);

    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(s => s + 10); // 10 points per correct answer
    }

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(i => i + 1);
      } else {
        setIsFinished(true);
      }
    }, 2000); // Wait 2 seconds before next question
  };

  const handleFinish = () => {
    onQuizComplete(score);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-surface rounded-2xl shadow-xl">
         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
         <p className="text-lg font-semibold text-text-primary">Generating your quiz on "{topic}"...</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-surface rounded-2xl shadow-xl text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">Quiz Complete!</h2>
        <p className="text-xl text-text-secondary mb-4">You scored</p>
        <p className="text-6xl font-bold text-secondary mb-6">{score} <span className="text-2xl">points</span></p>
        <button
          onClick={handleFinish}
          className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  if(questions.length === 0 && !isLoading) {
      return (
         <div className="flex flex-col items-center justify-center p-8 bg-surface rounded-2xl shadow-xl text-center">
            <h2 className="text-2xl font-bold text-red-500 dark:text-red-400 mb-4">Oops!</h2>
            <p className="text-text-secondary mb-6">We couldn't generate a quiz for "{topic}" at the moment. Please try another topic.</p>
            <button onClick={onBack} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">Go Back</button>
         </div>
      )
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="w-full max-w-2xl mx-auto bg-surface p-8 rounded-2xl shadow-2xl">
      <div className="flex justify-between items-start mb-4">
        <div>
            <p className="text-sm font-semibold text-primary">{topic} Quiz</p>
            <h2 className="text-2xl font-bold text-text-primary">{currentQuestion.question}</h2>
        </div>
        <p className="text-sm text-text-secondary font-medium bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
            {currentQuestionIndex + 1} / {questions.length}
        </p>
      </div>

      <div className="space-y-3 mt-6">
        {currentQuestion.options.map(option => {
          const isCorrect = option === currentQuestion.correctAnswer;
          const isSelected = option === selectedAnswer;
          let buttonClass = 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-text-primary';
          if (showFeedback) {
            if (isCorrect) buttonClass = 'bg-green-500 text-white';
            else if (isSelected) buttonClass = 'bg-red-500 text-white';
            else buttonClass = 'bg-gray-100 dark:bg-gray-700 text-text-primary opacity-50 dark:opacity-60';
          }

          return (
            <button
              key={option}
              onClick={() => handleAnswerSelect(option)}
              disabled={showFeedback}
              className={`w-full text-left p-4 rounded-lg font-medium transition-all duration-300 ${buttonClass}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizView;