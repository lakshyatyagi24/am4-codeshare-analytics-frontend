'use client';

import { useState, useMemo } from 'react';
import { AuditLog } from '../types';

interface AuditLogWidgetProps {
  logs: AuditLog[];
}

export default function AuditLogWidget({ logs }: AuditLogWidgetProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'warning' | 'error'>('all');
  const [filterAction, setFilterAction] = useState<'all' | 'update' | 'create' | 'delete' | 'alert'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (filterStatus !== 'all' && log.status !== filterStatus) return false;
      if (filterAction !== 'all' && log.action !== filterAction) return false;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          log.user.toLowerCase().includes(searchLower) ||
          log.details.toLowerCase().includes(searchLower) ||
          (log.alliance_name && log.alliance_name.toLowerCase().includes(searchLower)) ||
          (log.player_name && log.player_name.toLowerCase().includes(searchLower))
        );
      }
      return true;
    });
  }, [logs, filterStatus, filterAction, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400 bg-green-900/20';
      case 'warning': return 'text-yellow-400 bg-yellow-900/20';
      case 'error': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '📝';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return '➕';
      case 'update': return '✏️';
      case 'delete': return '🗑️';
      case 'alert': return '🚨';
      default: return '📊';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 1) {
      return `${Math.floor(diffMs / (1000 * 60))}m ago`;
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Audit Log</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'success' | 'warning' | 'error')}
            className="px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value as 'all' | 'update' | 'create' | 'delete' | 'alert')}
            className="px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="alert">Alert</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No logs match the current filters.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="text-xl">
                    {getActionIcon(log.action)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-white font-medium">{log.user}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(log.status)}`}>
                        {getStatusIcon(log.status)} {log.status}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {formatTimestamp(log.timestamp)}
                      </span>
                    </div>

                    <div className="text-gray-300 text-sm mb-2">
                      {log.details}
                    </div>

                    {(log.alliance_name || log.player_name) && (
                      <div className="text-xs text-gray-400">
                        {log.alliance_name && <span>Alliance: {log.alliance_name}</span>}
                        {log.alliance_name && log.player_name && <span> • </span>}
                        {log.player_name && <span>Player: {log.player_name}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Log summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 rounded p-4">
          <div className="text-sm text-gray-400">Total Logs</div>
          <div className="text-2xl font-bold text-white">{logs.length}</div>
        </div>
        <div className="bg-gray-700 rounded p-4">
          <div className="text-sm text-gray-400">Success</div>
          <div className="text-2xl font-bold text-green-400">
            {logs.filter(l => l.status === 'success').length}
          </div>
        </div>
        <div className="bg-gray-700 rounded p-4">
          <div className="text-sm text-gray-400">Warnings</div>
          <div className="text-2xl font-bold text-yellow-400">
            {logs.filter(l => l.status === 'warning').length}
          </div>
        </div>
        <div className="bg-gray-700 rounded p-4">
          <div className="text-sm text-gray-400">Errors</div>
          <div className="text-2xl font-bold text-red-400">
            {logs.filter(l => l.status === 'error').length}
          </div>
        </div>
      </div>
    </div>
  );
}
