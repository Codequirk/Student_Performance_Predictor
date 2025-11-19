import React from 'react';
import PerformanceRadar from './PerformanceRadar';
import PerformanceBarChart from './PerformanceBarChart';

const getCategoryColor = (category) => {
  const colors = {
    Poor: 'text-red-600 bg-red-100',
    Average: 'text-yellow-600 bg-yellow-100',
    Good: 'text-green-600 bg-green-100',
    Excellent: 'text-blue-600 bg-blue-100',
  };
  return colors[category] || 'text-gray-600 bg-gray-100';
};

const getCategoryBorderColor = (category) => {
  const colors = {
    Poor: 'border-red-300',
    Average: 'border-yellow-300',
    Good: 'border-green-300',
    Excellent: 'border-blue-300',
  };
  return colors[category] || 'border-gray-300';
};

export default function ResultCard({ result }) {
  return (
    <div className="mt-8 space-y-6">
      <div className={`bg-white rounded-lg shadow-lg p-6 border-4 ${getCategoryBorderColor(result.predicted_category)}`}>
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Prediction Result</h3>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600 font-medium">Predicted Score</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">{result.predicted_score}%</p>
          </div>

          <div className={`p-4 rounded-lg ${getCategoryColor(result.predicted_category)}`}>
            <p className="text-sm font-medium">Performance Category</p>
            <p className="text-3xl font-bold mt-2">{result.predicted_category}</p>
          </div>
        </div>

        {result.message && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">{result.message}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PerformanceRadar probabilities={result.probabilities} />
        <PerformanceBarChart probabilities={result.probabilities} />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Detailed Probabilities</h3>
        <div className="space-y-2">
          {Object.entries(result.probabilities).map(([category, probability]) => (
            <div key={category} className="flex items-center justify-between">
              <span className="font-medium text-gray-700">{category}</span>
              <div className="flex items-center gap-2">
                <div className="w-48 bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${probability * 100}%`,
                      backgroundColor:
                        category === 'Excellent'
                          ? '#3b82f6'
                          : category === 'Good'
                          ? '#10b981'
                          : category === 'Average'
                          ? '#f59e0b'
                          : '#ef4444',
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-600 w-12 text-right">
                  {(probability * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
