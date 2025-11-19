import React from 'react';
import ScatterPlot from './ScatterPlot';
import SubjectPerformanceHistogram from './SubjectPerformanceHistogram';
import { useDarkMode } from '../context/DarkModeContext';

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

export default function ResultCard({ result, formData, onBack }) {
  const { isDarkMode } = useDarkMode();
  return (
    <div className="mt-8 space-y-6">
      {onBack && (
        <button
          onClick={onBack}
          className={`px-4 py-2 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-600 hover:bg-gray-700'} text-white rounded-lg transition`}
        >
          Back to Form
        </button>
      )}

      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-lg shadow-lg p-6 border-4 ${getCategoryBorderColor(result.predicted_category)}`}>
        <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Prediction Result</h3>

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
          <div className={`mt-4 p-3 ${isDarkMode ? 'bg-green-900 border-green-700 text-green-200' : 'bg-green-50 border-green-200 text-green-800'} border rounded-lg`}>
            <p className="text-sm">{result.message}</p>
          </div>
        )}
      </div>

      {/* Subject Performance */}
      {formData && formData.subjects && formData.subjects.length > 0 && (
        <SubjectPerformanceHistogram subjects={formData.subjects} />
      )}

      {/* Scatter Plot Analysis */}
      {formData && formData.assignments && (
        <ScatterPlot
          assignments={formData.assignments}
          subjects={formData.subjects}
          studyHours={formData.study_hours}
          attendance={formData.attendance}
        />
      )}

      {/* Study Recommendations */}
      {result.study_recommendations && result.study_recommendations.length > 0 && (
        <div className={`${isDarkMode ? 'bg-gray-800 border-blue-600' : 'bg-white'} rounded-lg shadow-lg p-6 border-l-4 border-blue-500`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Study Time Recommendations</h3>
          <div className="space-y-3">
            {result.study_recommendations.map((recommendation, index) => (
              <div key={index} className={`p-3 ${isDarkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-lg`}>
                <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subject Performance Details */}
      {result.subject_performance && result.subject_performance.length > 0 && (
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Subject Performance Details</h3>
          <div className="space-y-2">
            {result.subject_performance.map((subject, index) => (
              <div key={index} className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                <div className="flex-1">
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{subject.subject_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{subject.marks.toFixed(1)}%</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      subject.performance_flag === 'GOOD'
                        ? isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                        : subject.performance_flag === 'AVERAGE'
                        ? isDarkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                        : isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {subject.performance_flag}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      subject.pass_fail_status === 'PASS'
                        ? isDarkMode ? 'bg-green-900 text-green-200 border border-green-700' : 'bg-green-100 text-green-800 border border-green-300'
                        : isDarkMode ? 'bg-red-900 text-red-200 border border-red-700' : 'bg-red-100 text-red-800 border border-red-300'
                    }`}
                  >
                    {subject.pass_fail_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Detailed Probabilities</h3>
        <div className="space-y-2">
          {Object.entries(result.probabilities).map(([category, probability]) => (
            <div key={category} className="flex items-center justify-between">
              <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{category}</span>
              <div className="flex items-center gap-2">
                <div className={`w-48 rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
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
                <span className={`text-sm font-semibold w-12 text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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

