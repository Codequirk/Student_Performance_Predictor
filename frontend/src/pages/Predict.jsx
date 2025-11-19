import React from 'react';
import PredictionForm from '../components/PredictionForm';
import { useDarkMode } from '../context/DarkModeContext';

export default function Predict() {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} py-8`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Performance Prediction</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Enter your academic details below to get your performance prediction</p>
        </div>
        <PredictionForm />
      </div>
    </div>
  );
}
