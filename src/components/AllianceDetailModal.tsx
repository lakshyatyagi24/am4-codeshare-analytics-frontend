'use client';

import { useState } from 'react';
import { AllianceDetailView } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AllianceDetailModalProps {
  alliance: AllianceDetailView;
  isOpen: boolean;
  onClose: () => void;
}

export default function AllianceDetailModal({ alliance, isOpen, onClose }: AllianceDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'contributors' | 'cohort' | 'activity'>('overview');

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'contributors', label: 'Contributors', icon: '👥' },
    { id: 'cohort', label: 'Cohort Analysis', icon: '📈' },
    { id: 'activity', label: 'Activity', icon: '⚡' }
  ];

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Key Metrics */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Key Metrics</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Total Players</span>
            <span className="text-white font-semibold">{alliance.top_contributors.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Active Players</span>
            <span className="text-white font-semibold">
              {alliance.top_contributors.filter(p => p.status === 'active').length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">New Joiners (30d)</span>
            <span className="text-white font-semibold">{alliance.new_joiners.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Retention Rate</span>
            <span className="text-green-400 font-semibold">{alliance.retention_rate.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Chart */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={alliance.recent_activity.slice(-7)}>
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
            <Line
              type="monotone"
              dataKey="value"
              stroke="#00d4ff"
              strokeWidth={2}
              name="Activity"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderContributors = () => (
    <div className="space-y-6">
      {/* Top Contributors */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Top Contributors</h3>
        <div className="bg-gray-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-3 px-4 text-gray-300">Player</th>
                  <th className="text-right py-3 px-4 text-gray-300">Share %</th>
                  <th className="text-right py-3 px-4 text-gray-300">Contributed</th>
                  <th className="text-right py-3 px-4 text-gray-300">Flights</th>
                  <th className="text-center py-3 px-4 text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {alliance.top_contributors.slice(0, 10).map((player, index) => (
                  <tr key={index} className="border-b border-gray-600 hover:bg-gray-600">
                    <td className="py-3 px-4 text-white">{player.player_name}</td>
                    <td className="py-3 px-4 text-white text-right">{player.share.toFixed(1)}%</td>
                    <td className="py-3 px-4 text-white text-right">${player.contributed.toLocaleString()}</td>
                    <td className="py-3 px-4 text-white text-right">{player.flights}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        player.status === 'active' ? 'bg-green-600 text-white' :
                        player.status === 'new' ? 'bg-blue-600 text-white' :
                        'bg-red-600 text-white'
                      }`}>
                        {player.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Joiners */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Recent Joiners</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alliance.new_joiners.map((player, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4">
              <div className="text-white font-medium">{player.player_name}</div>
              <div className="text-gray-400 text-sm">Joined: {new Date(player.joined).toLocaleDateString()}</div>
              <div className="text-gray-400 text-sm">Share: {player.share.toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCohort = () => (
    <div className="space-y-6">
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Cohort Analysis by Join Date</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={alliance.cohort_data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="join_date" stroke="#9CA3AF" />
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
            <Bar dataKey="retention_rate_1w" fill="#00d4ff" name="1 Week" />
            <Bar dataKey="retention_rate_1m" fill="#4ecdc4" name="1 Month" />
            <Bar dataKey="retention_rate_3m" fill="#ffa726" name="3 Months" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Cohort Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3 px-4 text-gray-300">Join Date</th>
                <th className="text-left py-3 px-4 text-gray-300">Season</th>
                <th className="text-right py-3 px-4 text-gray-300">Players</th>
                <th className="text-right py-3 px-4 text-gray-300">1W Active</th>
                <th className="text-right py-3 px-4 text-gray-300">1M Active</th>
                <th className="text-right py-3 px-4 text-gray-300">3M Active</th>
              </tr>
            </thead>
            <tbody>
              {alliance.cohort_data.map((cohort, index) => (
                <tr key={index} className="border-b border-gray-600">
                  <td className="py-3 px-4 text-white">{cohort.join_date}</td>
                  <td className="py-3 px-4 text-gray-300">{cohort.season}</td>
                  <td className="py-3 px-4 text-white text-right">{cohort.players}</td>
                  <td className="py-3 px-4 text-white text-right">{cohort.active_after_1_week}</td>
                  <td className="py-3 px-4 text-white text-right">{cohort.active_after_1_month}</td>
                  <td className="py-3 px-4 text-white text-right">{cohort.active_after_3_months}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="bg-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Activity Timeline</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={alliance.recent_activity}>
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
          <Line
            type="monotone"
            dataKey="value"
            stroke="#00d4ff"
            strokeWidth={2}
            name="Activity Level"
          />
          <Line
            type="monotone"
            dataKey="change"
            stroke="#ff6b6b"
            strokeWidth={2}
            name="Change %"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">{alliance.alliance_name.toUpperCase()} - Detailed Analysis</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'contributors' | 'cohort' | 'activity')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-blue-500 bg-gray-800'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'contributors' && renderContributors()}
          {activeTab === 'cohort' && renderCohort()}
          {activeTab === 'activity' && renderActivity()}
        </div>
      </div>
    </div>
  );
}
