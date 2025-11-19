import React, { useEffect, useState } from 'react';
import { getModelInfo, getModelMetrics } from '../services/api';
import { useDarkMode } from '../context/DarkModeContext';

export default function AdminDashboard() {
  const { isDarkMode } = useDarkMode();
  const [modelInfo, setModelInfo] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const infoRes = await getModelInfo();
        setModelInfo(infoRes.data);

        const metricsRes = await getModelMetrics();
        setMetrics(metricsRes.data);
      } catch (err) {
        setError('Failed to load model information');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className={`text-center p-8 ${isDarkMode ? 'text-white' : ''}`}>Loading...</div>;
  }

  if (error) {
    return <div className={`p-4 ${isDarkMode ? 'bg-red-900 text-red-200 border border-red-700' : 'bg-red-100 text-red-700'} rounded`}>{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics && (
          <>
            <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-lg shadow p-6`}>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Model Accuracy</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{(metrics.accuracy * 100).toFixed(2)}%</p>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-lg shadow p-6`}>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Precision</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{(metrics.precision * 100).toFixed(2)}%</p>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-lg shadow p-6`}>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Recall</p>
              <p className="text-4xl font-bold text-yellow-600 mt-2">{(metrics.recall * 100).toFixed(2)}%</p>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-lg shadow p-6`}>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>F1 Score</p>
              <p className="text-4xl font-bold text-purple-600 mt-2">{(metrics.f1_score * 100).toFixed(2)}%</p>
            </div>
          </>
        )}
      </div>

      {modelInfo && (
        <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-lg shadow p-6`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Model Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-3`}>Model Details</h3>
              <div className={`space-y-2 ${isDarkMode ? 'text-gray-300' : ''}`}>
                <p>
                  <span className="font-medium">Model Type:</span> {modelInfo.model_name}
                </p>
                <p>
                  <span className="font-medium">Version:</span> {modelInfo.version}
                </p>
                <p>
                  <span className="font-medium">Accuracy:</span> {(modelInfo.accuracy * 100).toFixed(2)}%
                </p>
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-3`}>Input Features</h3>
              <div className={`space-y-1 ${isDarkMode ? 'text-gray-300' : ''}`}>
                {modelInfo.features.map((feature, idx) => (
                  <p key={idx}>
                    {idx + 1}. {feature.replace('_', ' ').toUpperCase()}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-3`}>Output Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {modelInfo.labels.map((label, idx) => {
                const colors = {
                  Poor: 'bg-red-100 text-red-800',
                  Average: 'bg-yellow-100 text-yellow-800',
                  Good: 'bg-green-100 text-green-800',
                  Excellent: 'bg-blue-100 text-blue-800',
                };
                return (
                  <div key={idx} className={`p-3 rounded-lg text-center font-semibold ${colors[label] || 'bg-gray-100'}`}>
                    {label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {metrics && (
        <div className={`mt-8 rounded-lg shadow p-6 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Training Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Training Samples</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{metrics.training_samples}</p>
            </div>
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Test Samples</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{metrics.test_samples}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
