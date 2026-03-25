import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';

const reminders = [
  "Turn off the lights when you leave a room to save energy! 💡",
  "Remember to use a reusable water bottle today. Stay hydrated, save the planet! 💧",
  "Did you know recycling one aluminum can saves enough energy to run a TV for 3 hours? ♻️",
  "Try a shorter shower today. Every drop counts! 🚿",
  "Avoid plastic bags when shopping. Your cloth bag is a superhero! 🛍️",
];

const EcoReminder: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [reminder, setReminder] = useState('');

  useEffect(() => {
    setReminder(reminders[Math.floor(Math.random() * reminders.length)]);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-blue-100 dark:bg-blue-900/50 border-l-4 border-blue-500 text-blue-800 dark:text-blue-200 p-4 rounded-r-lg shadow-md flex justify-between items-center">
      <div>
        <p className="font-bold">Eco-Reminder of the Day</p>
        <p className="text-sm">{reminder}</p>
      </div>
      <button onClick={() => setIsVisible(false)} className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 ml-4">
        <XIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default EcoReminder;
