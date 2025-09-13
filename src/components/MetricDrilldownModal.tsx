'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DrilldownData } from '../types';

interface MetricDrilldownModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: DrilldownData[];
}

export default function MetricDrilldownModal({
  isOpen,
  onClose,
  title,
  data
}: MetricDrilldownModalProps) {
  const [viewMode, setViewMode] = useState<'trend' | 'comparison'>('trend');

  if (!isOpen) return null;

  const colors = ['#00d4ff', '#ff6b6b', '#4ecdc4', '#ffa726'];

  const trendData = data.reduce((acc, item) => {
    const existing = acc.find(d => d.date === item.date);
    if (existing) {
      existing[item.alliance_name] = item.value;
    } else {
      acc.push({
        date: item.date,
        [item.alliance_name]: item.value
      });
    }
    return acc;
  }, [] as Record<string, string | number>[]);

  const comparisonData = Object.entries(
    data.reduce((acc, item) => {
      if (!acc[item.alliance_name]) acc[item.alliance_name] = 0;
      acc[item.alliance_name] += item.value;
      return acc;
    }, {} as Record<string, number>)
  ).map(([alliance, value]) => ({ alliance, value }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{title} - Detailed Analysis</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setViewMode('trend')}
            className={`px-4 py-2 rounded ${
              viewMode === 'trend'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Trend Analysis
          </button>
          <button
            onClick={() => setViewMode('comparison')}
            className={`px-4 py-2 rounded ${
              viewMode === 'comparison'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Alliance Comparison
          </button>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {viewMode === 'trend' ? (
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Trend Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Legend />
                  {Object.keys(trendData[0] || {}).filter(key => key !== 'date').map((alliance, index) => (
                    <Line
                      key={alliance}
                      type="monotone"
                      dataKey={alliance}
                      stroke={colors[index % colors.length]}
                      strokeWidth={2}
                      name={alliance}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Alliance Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="alliance" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Bar dataKey="value" fill="#00d4ff" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Summary Stats */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Summary Statistics</h3>
            <div className="space-y-4">
              {Object.entries(
                data.reduce((acc, item) => {
                  if (!acc[item.alliance_name]) {
                    acc[item.alliance_name] = { total: 0, avg: 0, count: 0, change: 0 };
                  }
                  acc[item.alliance_name].total += item.value;
                  acc[item.alliance_name].count += 1;
                  acc[item.alliance_name].change += item.change;
                  return acc;
                }, {} as Record<string, { total: number; avg: number; count: number; change: number }>)
              ).map(([alliance, stats], index) => (
                <div key={alliance} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="text-white font-medium">{alliance}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">
                      {stats.total.toLocaleString()}
                    </div>
                    <div className={`text-sm ${stats.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stats.change >= 0 ? '+' : ''}{stats.change.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="mt-6 bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Detailed Data</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-4 text-gray-300">Alliance</th>
                  <th className="text-left py-2 px-4 text-gray-300">Date</th>
                  <th className="text-right py-2 px-4 text-gray-300">Value</th>
                  <th className="text-right py-2 px-4 text-gray-300">Change</th>
                  <th className="text-center py-2 px-4 text-gray-300">Trend</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="py-2 px-4 text-white">{item.alliance_name}</td>
                    <td className="py-2 px-4 text-gray-300">{item.date}</td>
                    <td className="py-2 px-4 text-white text-right">{item.value.toLocaleString()}</td>
                    <td className={`py-2 px-4 text-right ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {item.change >= 0 ? '+' : ''}{item.change.toFixed(1)}%
                    </td>
                    <td className="py-2 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.trend === 'up' ? 'bg-green-600 text-white' :
                        item.trend === 'down' ? 'bg-red-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {item.trend.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
