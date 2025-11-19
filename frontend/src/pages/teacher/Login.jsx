import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../context/DarkModeContext';
import * as api from '../../services/api';

function Login() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await api.teacherLogin({
        email: formData.email,
        password: formData.password,
      });

      // Store token and email in localStorage
      if (response.data.access_token) {
        localStorage.setItem('teacherToken', response.data.access_token);
        localStorage.setItem('teacherEmail', response.data.teacher_email);
      }

      // Redirect to dashboard
      navigate('/teacher/dashboard');
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || 'Login failed. Please check your credentials.';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 transition-colors ${
      isDarkMode
        ? 'bg-gradient-to-br from-gray-900 to-gray-800'
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className={`rounded-lg shadow-xl max-w-md w-full p-8 transition-colors ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Teacher Login</h1>
          <p className={`mt-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Sign in to your account</p>
        </div>

        {/* Error Messages */}
        {errors.submit && (
          <div className={`mb-6 p-4 border-l-4 border-red-500 rounded ${
            isDarkMode ? 'bg-red-900/20' : 'bg-red-50'
          }`}>
            <p className={isDarkMode ? 'text-red-300' : 'text-red-700'}>{errors.submit}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                isDarkMode
                  ? `bg-gray-700 text-white ${
                      errors.email ? 'border-red-400' : 'border-gray-600'
                    }`
                  : `bg-white text-gray-900 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`
              }`}
              placeholder="your.email@school.com"
              disabled={loading}
            />
            {errors.email && (
              <p className={`text-sm mt-1 ${
                isDarkMode ? 'text-red-300' : 'text-red-500'
              }`}>{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                isDarkMode
                  ? `bg-gray-700 text-white ${
                      errors.password ? 'border-red-400' : 'border-gray-600'
                    }`
                  : `bg-white text-gray-900 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`
              }`}
              placeholder="Enter your password"
              disabled={loading}
            />
            {errors.password && (
              <p className={`text-sm mt-1 ${
                isDarkMode ? 'text-red-300' : 'text-red-500'
              }`}>{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Register Link */}
        <p className={`text-center mt-6 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/teacher/register')}
            className={`font-semibold hover:underline ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
