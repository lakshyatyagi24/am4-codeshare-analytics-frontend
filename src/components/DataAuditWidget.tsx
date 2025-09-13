'use client';

import { DataAudit } from '../types';

interface DataAuditWidgetProps {
  auditData: DataAudit;
}

export default function DataAuditWidget({ auditData }: DataAuditWidgetProps) {
  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'low': return 'text-blue-400 bg-blue-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getQualityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatLastUpdate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Data Audit</h2>
        <div className="text-right">
          <div className="text-sm text-gray-400">Last Update</div>
          <div className="text-white font-medium">{formatLastUpdate(auditData.last_update)}</div>
        </div>
      </div>

      {/* Data Quality Score */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">Data Quality Score</span>
          <span className={`text-lg font-bold ${getQualityScoreColor(auditData.data_quality_score)}`}>
            {auditData.data_quality_score}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              auditData.data_quality_score >= 90 ? 'bg-green-500' :
              auditData.data_quality_score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${auditData.data_quality_score}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Missing Data Alerts */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Missing Data Alerts</h3>
          {auditData.missing_data_alerts.length === 0 ? (
            <div className="text-center py-4 text-gray-400">
              No missing data alerts
            </div>
          ) : (
            <div className="space-y-3">
              {auditData.missing_data_alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-3 rounded border-l-4 ${
                    alert.severity === 'high' ? 'border-red-500 bg-red-900/10' :
                    alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-900/10' :
                    'border-blue-500 bg-blue-900/10'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-white font-medium">{alert.alliance}</div>
                      <div className="text-sm text-gray-400">
                        Missing: {alert.missing_fields.join(', ')}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Duplicate Checks */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Duplicate Checks</h3>
          {auditData.duplicate_checks.length === 0 ? (
            <div className="text-center py-4 text-gray-400">
              No duplicate checks available
            </div>
          ) : (
            <div className="space-y-3">
              {auditData.duplicate_checks.map((check, index) => (
                <div key={index} className="bg-gray-700 rounded p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium">{check.table}</div>
                      <div className="text-sm text-gray-400">
                        Duplicates found: {check.duplicates_found}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        check.resolved ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {check.resolved ? 'Resolved' : 'Pending'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
            Refresh Data
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm">
            Run Audit
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm">
            View Report
          </button>
        </div>
      </div>
    </div>
  );
}
