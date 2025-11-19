import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function PerformanceRadar({ probabilities }) {
  const data = Object.entries(probabilities).map(([label, value]) => ({
    category: label,
    probability: (value * 100).toFixed(2),
  }));

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Probability Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="category" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} />
          <Radar
            name="Probability (%)"
            dataKey="probability"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
