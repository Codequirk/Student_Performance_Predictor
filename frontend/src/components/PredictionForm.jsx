import React, { useState } from 'react';
import { predict } from '../services/api';
import ResultCard from './ResultCard';

const initialState = {
  student_name: '',
  roll_number: '',
  attendance: '',
  assignment_score: '',
  internal_marks: '',
  prev_cgpa: '',
  study_hours: '',
  sleep_hours: '',
};

export default function PredictionForm() {
  const [form, setForm] = useState(initialState);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        student_name: form.student_name || 'Anonymous',
        roll_number: form.roll_number || 'N/A',
        attendance: parseFloat(form.attendance),
        assignment_score: parseFloat(form.assignment_score),
        internal_marks: parseFloat(form.internal_marks),
        prev_cgpa: parseFloat(form.prev_cgpa),
        study_hours: parseFloat(form.study_hours),
        sleep_hours: parseFloat(form.sleep_hours),
      };

      const response = await predict(payload);
      setResult(response.data);
      setForm(initialState);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error making prediction. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Predict Student Performance</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
              <input
                type="text"
                name="student_name"
                value={form.student_name}
                onChange={handleChange}
                placeholder="Enter student name (optional)"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
              <input
                type="text"
                name="roll_number"
                value={form.roll_number}
                onChange={handleChange}
                placeholder="Enter roll number (optional)"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Academic Metrics */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attendance (%)</label>
              <input
                type="number"
                name="attendance"
                min="0"
                max="100"
                step="0.1"
                value={form.attendance}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Score (0-100)</label>
              <input
                type="number"
                name="assignment_score"
                min="0"
                max="100"
                step="0.1"
                value={form.assignment_score}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Internal Marks (0-50)</label>
              <input
                type="number"
                name="internal_marks"
                min="0"
                max="50"
                step="0.1"
                value={form.internal_marks}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Previous CGPA (0-10)</label>
              <input
                type="number"
                name="prev_cgpa"
                min="0"
                max="10"
                step="0.1"
                value={form.prev_cgpa}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Lifestyle Metrics */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Study Hours per Day (0-24)</label>
              <input
                type="number"
                name="study_hours"
                min="0"
                max="24"
                step="0.5"
                value={form.study_hours}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sleep Hours per Day (0-24)</label>
              <input
                type="number"
                name="sleep_hours"
                min="0"
                max="24"
                step="0.5"
                value={form.sleep_hours}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            {loading ? 'Predicting...' : 'Predict Performance'}
          </button>
        </form>
      </div>

      {result && <ResultCard result={result} />}
    </div>
  );
}
