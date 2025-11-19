import React from 'react';
import PredictionForm from '../components/PredictionForm';

export default function Predict() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Performance Prediction</h1>
          <p className="text-gray-600">Enter your academic details below to get your performance prediction</p>
        </div>
        <PredictionForm />
      </div>
    </div>
  );
}
