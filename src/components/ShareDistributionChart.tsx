import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { AllianceOverview } from '../types';

interface ShareDistributionChartProps {
  data: AllianceOverview[];
}

export const ShareDistributionChart: React.FC<ShareDistributionChartProps> = ({ data }) => {
  const COLORS = ['#00d4ff', '#ff6b6b', '#4ecdc4', '#ffa726'];

  const chartData = data.map((alliance) => ({
    name: alliance.alliance_name.toUpperCase(),
    value: alliance.total_share,
    fill: COLORS[data.indexOf(alliance) % COLORS.length]
  }));

  return (
    <div className="panel">
      <h3 className="panel-title">Share Distribution by Alliance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
