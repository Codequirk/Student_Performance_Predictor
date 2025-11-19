import React from 'react';
import AdminDashboard from '../components/AdminDashboard';
import { useDarkMode } from '../context/DarkModeContext';

export default function Admin() {
  const { isDarkMode } = useDarkMode();
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} py-8`}>
      <AdminDashboard />
    </div>
  );
}
