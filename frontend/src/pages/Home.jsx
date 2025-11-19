import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Student Performance Predictor
          </h1>
          <p className="text-xl text-gray-600">
            An intelligent system powered by machine learning to predict your academic performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Data-Driven Insights</h3>
            <p className="text-gray-600">
              Our model analyzes your attendance, assignments, internal marks, CGPA, study hours, and sleep patterns to provide accurate predictions.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">AI-Powered</h3>
            <p className="text-gray-600">
              Built with Random Forest, Logistic Regression, SVM, and XGBoost models to ensure high accuracy and reliability.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Performance Metrics</h3>
            <p className="text-gray-600">
              Get detailed probability distributions and category predictions (Poor, Average, Good, Excellent) for your performance.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">How It Works</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Enter Your Details</h4>
                <p className="text-gray-600">Fill in your attendance, assignment scores, internal marks, CGPA, study hours, and sleep hours.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">ML Model Analyzes</h4>
                <p className="text-gray-600">Our trained machine learning model processes your data and generates predictions.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Get Results</h4>
                <p className="text-gray-600">Receive your predicted score, performance category, and probability distribution visualizations.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6">Navigate to the Predict page to see your performance prediction.</p>
          <a
            href="/predict"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Make a Prediction
          </a>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Performance Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-red-100 p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-red-600">Poor</h3>
              <p className="text-gray-600 mt-2">Score: 0-50</p>
              <p className="text-sm text-gray-500 mt-2">Needs improvement</p>
            </div>

            <div className="bg-yellow-100 p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-yellow-600">Average</h3>
              <p className="text-gray-600 mt-2">Score: 50-65</p>
              <p className="text-sm text-gray-500 mt-2">Satisfactory performance</p>
            </div>

            <div className="bg-green-100 p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-green-600">Good</h3>
              <p className="text-gray-600 mt-2">Score: 65-80</p>
              <p className="text-sm text-gray-500 mt-2">Strong performance</p>
            </div>

            <div className="bg-blue-100 p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-blue-600">Excellent</h3>
              <p className="text-gray-600 mt-2">Score: 80-100</p>
              <p className="text-sm text-gray-500 mt-2">Exceptional performance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
