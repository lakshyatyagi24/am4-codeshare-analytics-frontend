import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { AllianceOverview } from '../types';

interface TrendsChartProps {
  trendData: Array<{ date: string; [key: string]: number | string }>;
  data: AllianceOverview[];
}

export const TrendsChart: React.FC<TrendsChartProps> = ({ trendData, data }) => {
  const COLORS = ['#00d4ff', '#ff6b6b', '#4ecdc4', '#ffa726'];

  return (
    <div className="panel">
      <h3 className="panel-title">Contribution Trends Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
          <Legend />
          {data.map((alliance, index) => (
            <Line
              key={alliance.alliance_name}
              type="monotone"
              dataKey={`${alliance.alliance_name}_contributed`}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              name={alliance.alliance_name.toUpperCase()}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
