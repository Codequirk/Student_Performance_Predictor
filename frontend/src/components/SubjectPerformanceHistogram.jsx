import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useDarkMode } from "../context/DarkModeContext";

export default function SubjectPerformanceHistogram({ subjects }) {
  const { isDarkMode } = useDarkMode();
  // Calculate percentages from marks_obtained and marks_total
  const subjectsWithPercentages = subjects.map((subject) => {
    const percentage = subject.marks_total > 0 
      ? (subject.marks_obtained / subject.marks_total) * 100 
      : 0;
    return {
      ...subject,
      percentage: percentage,
    };
  });

  // Prepare data for histogram
  const data = subjectsWithPercentages.map((subject) => ({
    name: subject.subject_name.substring(0, 10),
    percentage: subject.percentage,
    fill:
      subject.percentage >= 80
        ? "#22c55e"
        : subject.percentage >= 60
        ? "#f59e0b"
        : "#ef4444",
  }));

  const avgMarks = subjectsWithPercentages.reduce((sum, s) => sum + s.percentage, 0) / subjectsWithPercentages.length;

  return (
    <div className={`mt-6 p-4 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-lg shadow`}>
      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Subject Performance</h3>
      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>Average: {avgMarks.toFixed(2)}%</p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: "Percentage (%)", angle: -90, position: "insideLeft" }} domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="percentage" fill="#8884d8" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Bar key={index} dataKey="percentage" fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {subjectsWithPercentages.map((subject, idx) => (
          <div
            key={idx}
            className={`p-3 rounded text-white text-sm font-medium ${
              subject.percentage >= 80
                ? "bg-green-500"
                : subject.percentage >= 60
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          >
            <p className="font-semibold">{subject.subject_name}</p>
            <p>{subject.percentage.toFixed(1)}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
