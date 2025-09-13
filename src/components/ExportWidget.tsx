'use client';

import { useState } from 'react';
import { ExportOptions } from '../types';

interface ExportWidgetProps {
  onExport: (options: ExportOptions) => void;
  availableAlliances: string[];
}

export default function ExportWidget({ onExport, availableAlliances }: ExportWidgetProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    includeCharts: true,
    includeTables: true,
    dateRange: { period: 'month' },
    selectedAlliances: availableAlliances
  });

  const handleExport = () => {
    onExport(exportOptions);
  };

  const handleAllianceToggle = (alliance: string) => {
    setExportOptions(prev => ({
      ...prev,
      selectedAlliances: prev.selectedAlliances.includes(alliance)
        ? prev.selectedAlliances.filter(a => a !== alliance)
        : [...prev.selectedAlliances, alliance]
    }));
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Export Dashboard</h3>

      <div className="space-y-4">
        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Export Format
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setExportOptions(prev => ({ ...prev, format: 'csv' }))}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                exportOptions.format === 'csv'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              CSV
            </button>
            <button
              onClick={() => setExportOptions(prev => ({ ...prev, format: 'png' }))}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                exportOptions.format === 'png'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              PNG
            </button>
          </div>
        </div>

        {/* Content Options */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Include Content
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={exportOptions.includeCharts}
                onChange={(e) => setExportOptions(prev => ({
                  ...prev,
                  includeCharts: e.target.checked
                }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-300">Charts & Visualizations</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={exportOptions.includeTables}
                onChange={(e) => setExportOptions(prev => ({
                  ...prev,
                  includeTables: e.target.checked
                }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-300">Data Tables</span>
            </label>
          </div>
        </div>

        {/* Alliance Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Alliances ({exportOptions.selectedAlliances.length} selected)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {availableAlliances.map((alliance) => (
              <label key={alliance} className="flex items-center">
                <input
                  type="checkbox"
                  checked={exportOptions.selectedAlliances.includes(alliance)}
                  onChange={() => handleAllianceToggle(alliance)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-300">{alliance}</span>
              </label>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setExportOptions(prev => ({
                ...prev,
                selectedAlliances: availableAlliances
              }))}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Select All
            </button>
            <button
              onClick={() => setExportOptions(prev => ({
                ...prev,
                selectedAlliances: []
              }))}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Export Button */}
        <div className="pt-4 border-t border-gray-700">
          <button
            onClick={handleExport}
            disabled={exportOptions.selectedAlliances.length === 0}
            className={`w-full py-2 px-4 rounded font-medium transition-colors ${
              exportOptions.selectedAlliances.length === 0
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            Export {exportOptions.format.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}
