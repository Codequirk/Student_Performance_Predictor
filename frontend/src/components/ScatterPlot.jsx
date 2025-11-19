import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useDarkMode } from "../context/DarkModeContext";

export default function ScatterPlot({ assignments, subjects, studyHours, attendance }) {
  const { isDarkMode } = useDarkMode();
  // Prepare data for scatter plot
  const data = [];

  // Add study hours vs marks relationship
  let cumulativeHours = 0;
  assignments.forEach((assignment, idx) => {
    const percentage = assignment.marks_total > 0 
      ? (assignment.marks_obtained / assignment.marks_total) * 100 
      : 0;
    cumulativeHours += studyHours / Math.max(assignments.length, 1);
    data.push({
      name: `${assignment.subject_name} (A)`,
      hours: parseFloat((studyHours * (idx + 1) / assignments.length).toFixed(2)),
      percentage: percentage,
      type: "Assignment",
    });
  });

  subjects.forEach((subject, idx) => {
    const percentage = subject.marks_total > 0 
      ? (subject.marks_obtained / subject.marks_total) * 100 
      : 0;
    data.push({
      name: `${subject.subject_name} (S)`,
      hours: parseFloat((studyHours * (idx + 1) / subjects.length).toFixed(2)),
      percentage: percentage,
      type: "Subject",
    });
  });

  // Add attendance vs performance
  const avgSubjectPercentage =
    subjects.reduce((sum, s) => {
      const pct = s.marks_total > 0 ? (s.marks_obtained / s.marks_total) * 100 : 0;
      return sum + pct;
    }, 0) / Math.max(subjects.length, 1);

  return (
    <div className={`mt-6 p-4 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-lg shadow`}>
      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
        Study Hours vs Performance Analysis
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="hours"
            type="number"
            name="Study Hours"
            label={{ value: "Study Hours/Day", position: "insideBottomRight", offset: -5 }}
          />
          <YAxis
            dataKey="percentage"
            type="number"
            name="Percentage"
            label={{ value: "Percentage (%)", angle: -90, position: "insideLeft" }}
            domain={[0, 100]}
          />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Legend />
          <Scatter
            name="Assignments"
            data={data.filter((d) => d.type === "Assignment")}
            fill="#8884d8"
          />
          <Scatter
            name="Subjects"
            data={data.filter((d) => d.type === "Subject")}
            fill="#82ca9d"
          />
        </ScatterChart>
      </ResponsiveContainer>
      <p className={`mt-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        This chart shows the relationship between study hours dedicated to each subject/assignment
        and the marks obtained. Higher study hours generally correlate with better performance.
      </p>
    </div>
  );
}
