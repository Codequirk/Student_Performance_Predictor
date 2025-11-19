import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Predict from './pages/Predict';
import Admin from './pages/Admin';
import Register from './pages/teacher/Register';
import Login from './pages/teacher/Login';
import Dashboard from './pages/teacher/Dashboard';
import { DarkModeProvider, useDarkMode } from './context/DarkModeContext';
import './index.css';

function AppContent() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <Router>
      <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        {/* Navigation Bar */}
        <nav className={`${isDarkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} text-white shadow-lg`}>
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold hover:opacity-90 transition">
              <span>⌘</span>
              <span>Student Predictor</span>
            </Link>

            <div className="flex gap-6 items-center">
              <Link
                to="/"
                className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white hover:bg-opacity-20'} px-4 py-2 rounded-lg transition`}
              >
                Home
              </Link>
              <Link
                to="/predict"
                className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white hover:bg-opacity-20'} px-4 py-2 rounded-lg transition`}
              >
                Predict
              </Link>
              <Link
                to="/admin"
                className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white hover:bg-opacity-20'} px-4 py-2 rounded-lg transition`}
              >
                Dashboard
              </Link>
              <Link
                to="/teacher/login"
                className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white hover:bg-opacity-20'} px-4 py-2 rounded-lg transition`}
              >
                Teacher Portal
              </Link>
              <button
                onClick={toggleDarkMode}
                className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white bg-opacity-20 hover:bg-opacity-30'} px-4 py-2 rounded-lg transition text-lg`}
                title="Toggle dark mode"
              >
                {isDarkMode ? '☀︎' : '☾'}
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/teacher/register" element={<Register />} />
            <Route path="/teacher/login" element={<Login />} />
            <Route path="/teacher/dashboard" element={<Dashboard />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className={`${isDarkMode ? 'bg-gray-800 text-gray-200 border-t border-gray-700' : 'bg-gray-800 text-white'} mt-16`}>
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold mb-4">About</h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-300'} text-sm`}>
                  Student Performance Predictor is an AI-powered system that predicts academic performance using machine learning.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-300'}`}>
                  <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                  <li><Link to="/predict" className="hover:text-white transition">Predictions</Link></li>
                  <li><Link to="/admin" className="hover:text-white transition">Dashboard</Link></li>
                  <li><Link to="/teacher/login" className="hover:text-white transition">Teacher Portal</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Contact</h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-300'} text-sm`}>
                  Email: support@studentpredictor.com
                </p>
              </div>
            </div>

            <hr className={`${isDarkMode ? 'border-gray-700' : 'border-gray-700'} mb-6`} />

            <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-300'} text-sm`}>
              <p>&copy; 2025 Student Performance Predictor. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  );
}

export default App;
