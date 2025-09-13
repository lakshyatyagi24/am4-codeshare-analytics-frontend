'use client';

import { useState } from 'react';
import { AnomalyAlert } from '../types';

interface AnomalyAlertsProps {
  alerts: AnomalyAlert[];
  onDismiss: (alertId: string) => void;
}

export default function AnomalyAlerts({ alerts, onDismiss }: AnomalyAlertsProps) {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterType, setFilterType] = useState<'all' | 'spike' | 'dip' | 'anomaly'>('all');

  const filteredAlerts = alerts.filter(alert => {
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    if (filterType !== 'all' && alert.type !== filterType) return false;
    return true;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-900/20';
      case 'low': return 'border-blue-500 bg-blue-900/20';
      default: return 'border-gray-500 bg-gray-900/20';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return 'ℹ️';
      default: return '📊';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'spike': return '📈';
      case 'dip': return '📉';
      case 'anomaly': return '🔍';
      default: return '📊';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Anomaly Alerts</h2>
        <div className="flex gap-4">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as 'all' | 'high' | 'medium' | 'low')}
            className="px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'spike' | 'dip' | 'anomaly')}
            className="px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="spike">Spikes</option>
            <option value="dip">Dips</option>
            <option value="anomaly">Anomalies</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No alerts match the current filters.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`border-l-4 p-4 rounded-r-lg ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">
                    {getTypeIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-semibold text-white">
                        {alert.description}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        alert.severity === 'high' ? 'bg-red-600 text-white' :
                        alert.severity === 'medium' ? 'bg-yellow-600 text-white' :
                        'bg-blue-600 text-white'
                      }`}>
                        {getSeverityIcon(alert.severity)} {alert.severity.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-sm text-gray-300 space-y-1">
                      <div>
                        <span className="font-medium">Alliance:</span> {alert.alliance_name}
                      </div>
                      {alert.player_name && (
                        <div>
                          <span className="font-medium">Player:</span> {alert.player_name}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Metric:</span> {alert.metric}
                      </div>
                      <div>
                        <span className="font-medium">Value:</span> {alert.value.toLocaleString()} |
                        <span className="font-medium"> Threshold:</span> {alert.threshold.toLocaleString()}
                      </div>
                      <div className="text-gray-400">
                        {formatTimestamp(alert.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDismiss(alert.id)}
                  className="text-gray-400 hover:text-white text-xl ml-4"
                  title="Dismiss alert"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Alert summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 rounded p-4">
          <div className="text-sm text-gray-400">Total Alerts</div>
          <div className="text-2xl font-bold text-white">{alerts.length}</div>
        </div>
        <div className="bg-gray-700 rounded p-4">
          <div className="text-sm text-gray-400">High Priority</div>
          <div className="text-2xl font-bold text-red-400">
            {alerts.filter(a => a.severity === 'high').length}
          </div>
        </div>
        <div className="bg-gray-700 rounded p-4">
          <div className="text-sm text-gray-400">Medium Priority</div>
          <div className="text-2xl font-bold text-yellow-400">
            {alerts.filter(a => a.severity === 'medium').length}
          </div>
        </div>
        <div className="bg-gray-700 rounded p-4">
          <div className="text-sm text-gray-400">Low Priority</div>
          <div className="text-2xl font-bold text-blue-400">
            {alerts.filter(a => a.severity === 'low').length}
          </div>
        </div>
      </div>
    </div>
  );
}
