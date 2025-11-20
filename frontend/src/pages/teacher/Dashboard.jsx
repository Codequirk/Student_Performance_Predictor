import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../context/DarkModeContext';
import * as api from '../../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [csvFile, setCsvFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [batchResults, setBatchResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const token = localStorage.getItem('teacherToken');

  // Fetch teacher info on mount
  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        if (!token) {
          navigate('/teacher/login');
          return;
        }

        const response = await api.getTeacherInfo(token);
        setTeacherInfo(response.data);
      } catch (error) {
        // Token expired or invalid
        localStorage.removeItem('teacherToken');
        localStorage.removeItem('teacherEmail');
        navigate('/teacher/login');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherInfo();
  }, [token, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setUploadError('Please select a CSV file');
        setCsvFile(null);
        return;
      }
      setCsvFile(file);
      setUploadError('');
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await api.downloadCSVTemplate();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'student_template.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      setUploadError('Failed to download template');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!csvFile) {
      setUploadError('Please select a CSV file');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const response = await api.uploadCSV(csvFile, token);
      setUploadSuccess(
        `✅ Successfully processed ${response.data.total_processed} students!`
      );
      setBatchResults(response.data);
      setShowResults(true);
      setCsvFile(null);

      // Clear file input
      const fileInput = document.getElementById('csvFile');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        'Failed to upload CSV. Please check the file format.';
      setUploadError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const downloadResults = () => {
    if (!batchResults) return;

    // Create CSV from results
    const headers = [
      'Student Name',
      'Roll Number',
      'Attendance',
      'Avg Subject Marks',
      'Avg Assignment Marks',
      'Predicted Category',
      'Score',
      'Probability',
      'Pass/Fail Status',
    ];

    const rows = batchResults.results.map((result) => [
      result.student_name,
      result.roll_number,
      result.attendance,
      result.avg_subject_marks || 'N/A',
      result.avg_assignment_marks || 'N/A',
      result.predicted_category,
      result.predicted_score?.toFixed(2) || 'N/A',
      result.probabilities
        ? `${(Math.max(...Object.values(result.probabilities)) * 100).toFixed(1)}%`
        : 'N/A',
      result.pass_fail_status || 'N/A',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${cell}"`).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `results_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const handleLogout = () => {
    localStorage.removeItem('teacherToken');
    localStorage.removeItem('teacherEmail');
    navigate('/teacher/login');
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className={`text-lg ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 px-4 transition-colors ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`rounded-lg shadow-md p-6 mb-8 transition-colors ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className={`text-3xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Teacher Dashboard</h1>
              {teacherInfo && (
                <div className="mt-4 space-y-2">
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    <span className="font-semibold">Name:</span> {teacherInfo.full_name}
                  </p>
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    <span className="font-semibold">College:</span> {teacherInfo.school_name}
                  </p>
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    <span className="font-semibold">Email:</span> {teacherInfo.email}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-700 hover:bg-red-900 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Upload Section */}
        <div className={`rounded-lg shadow-md p-6 mb-8 transition-colors ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className={`text-2xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Upload Student Data</h2>

          {/* Error Messages */}
          {uploadError && (
            <div className={`mb-6 p-4 border-l-4 border-red-500 rounded ${
              isDarkMode ? 'bg-red-900/20' : 'bg-red-50'
            }`}>
              <p className={isDarkMode ? 'text-red-300' : 'text-red-700'}>{uploadError}</p>
            </div>
          )}

          {/* Success Messages */}
          {uploadSuccess && (
            <div className={`mb-6 p-4 border-l-4 border-green-500 rounded ${
              isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
            }`}>
              <p className={isDarkMode ? 'text-green-300' : 'text-green-700'}>{uploadSuccess}</p>
            </div>
          )}

          {/* Instructions */}
          <div className={`border-l-4 border-blue-500 p-4 mb-6 rounded ${
            isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
          }`}>
            <p className={isDarkMode ? 'text-blue-200' : 'text-blue-800'}>
              <span className="font-semibold">Instructions:</span> Upload a CSV file with
              student data. Download the template below to see the expected format.
            </p>
          </div>

          {/* Template Download */}
          <button
            onClick={downloadTemplate}
            className="mb-6 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-4 rounded-lg transition inline-block"
          >
             Download CSV Template
          </button>

          {/* File Upload Form */}
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Select CSV File *
              </label>
              <input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                disabled={uploading}
              />
              <p className={`text-sm mt-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {csvFile ? `Selected: ${csvFile.name}` : 'No file selected'}
              </p>
            </div>

            <button
              type="submit"
              disabled={uploading || !csvFile}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Processing...' : ' Upload & Process'}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {showResults && batchResults && (
          <div className={`rounded-lg shadow-md p-6 transition-colors ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Processing Results ({batchResults.total_processed} Students)
              </h2>
              <button
                onClick={downloadResults}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                📥 Download Results
              </button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className={isDarkMode ? 'bg-blue-900/30 p-4 rounded-lg' : 'bg-blue-50 p-4 rounded-lg'}>
                <p className={`text-sm font-semibold ${
                  isDarkMode ? 'text-blue-200' : 'text-gray-600'
                }`}>Total Processed</p>
                <p className={`text-3xl font-bold mt-2 ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-600'
                }`}>
                  {batchResults.total_processed}
                </p>
              </div>
              <div className={isDarkMode ? 'bg-green-900/30 p-4 rounded-lg' : 'bg-green-50 p-4 rounded-lg'}>
                <p className={`text-sm font-semibold ${
                  isDarkMode ? 'text-green-200' : 'text-gray-600'
                }`}>Success</p>
                <p className={`text-3xl font-bold mt-2 ${
                  isDarkMode ? 'text-green-300' : 'text-green-600'
                }`}>
                  {batchResults.results.filter((r) => !r.error).length}
                </p>
              </div>
              <div className={isDarkMode ? 'bg-red-900/30 p-4 rounded-lg' : 'bg-red-50 p-4 rounded-lg'}>
                <p className={`text-sm font-semibold ${
                  isDarkMode ? 'text-red-200' : 'text-gray-600'
                }`}>Errors</p>
                <p className={`text-3xl font-bold mt-2 ${
                  isDarkMode ? 'text-red-300' : 'text-red-600'
                }`}>
                  {batchResults.results.filter((r) => r.error).length}
                </p>
              </div>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b-2 ${
                    isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
                  }`}>
                    <th className={`text-left py-3 px-4 font-semibold ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Student Name
                    </th>
                    <th className={`text-left py-3 px-4 font-semibold ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Roll No.
                    </th>
                    <th className={`text-center py-3 px-4 font-semibold ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Attendance
                    </th>
                    <th className={`text-center py-3 px-4 font-semibold ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Prediction
                    </th>
                    <th className={`text-center py-3 px-4 font-semibold ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Score
                    </th>
                    <th className={`text-center py-3 px-4 font-semibold ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Confidence
                    </th>
                    <th className={`text-center py-3 px-4 font-semibold ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {batchResults.results.map((result, idx) => (
                    <tr
                      key={idx}
                      className={`border-b transition ${
                        isDarkMode
                          ? 'border-gray-600 hover:bg-gray-700'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <td className={`py-3 px-4 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>{result.student_name}</td>
                      <td className={`py-3 px-4 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>{result.roll_number}</td>
                      <td className={`py-3 px-4 text-center ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {result.attendance}%
                      </td>
                      <td
                        className={`py-3 px-4 text-center font-semibold ${
                          result.predicted_category === 'Good'
                            ? 'text-green-600'
                            : result.predicted_category === 'Average'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {result.predicted_category}
                      </td>
                      <td className={`py-3 px-4 text-center ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {result.predicted_score?.toFixed(2) || 'N/A'}
                      </td>
                      <td className={`py-3 px-4 text-center ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {result.probabilities
                          ? `${(Math.max(...Object.values(result.probabilities)) * 100).toFixed(1)}%`
                          : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {result.error ? (
                          <span className="text-red-600 font-semibold">❌ Error</span>
                        ) : (
                          <span className="text-green-600 font-semibold">✅ Success</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Error Details */}
            {batchResults.results.some((r) => r.error) && (
              <div className={`mt-6 p-4 border-l-4 border-red-500 rounded ${
                isDarkMode ? 'bg-red-900/20' : 'bg-red-50'
              }`}>
                <p className={`font-semibold mb-3 ${
                  isDarkMode ? 'text-red-300' : 'text-red-700'
                }`}>Errors:</p>
                <ul className="space-y-2">
                  {batchResults.results
                    .filter((r) => r.error)
                    .map((result, idx) => (
                      <li key={idx} className={`text-sm ${
                        isDarkMode ? 'text-red-300' : 'text-red-600'
                      }`}>
                        <span className="font-semibold">{result.student_name}:</span>{' '}
                        {result.error}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
