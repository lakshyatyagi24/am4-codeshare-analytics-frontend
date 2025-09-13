'use client';

import { useState } from 'react';
import { TimeFilter, NormalizationOptions } from '../types';

interface AdvancedFiltersProps {
  onTimeFilterChange: (filter: TimeFilter) => void;
  onNormalizationChange: (options: NormalizationOptions) => void;
  currentTimeFilter: TimeFilter;
  currentNormalization: NormalizationOptions;
}

export default function AdvancedFilters({
  onTimeFilterChange,
  onNormalizationChange,
  currentTimeFilter,
  currentNormalization
}: AdvancedFiltersProps) {
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  const handleTimePeriodChange = (period: 'week' | 'month' | 'season' | 'custom') => {
    if (period === 'custom') {
      setShowCustomDatePicker(true);
    } else {
      setShowCustomDatePicker(false);
      onTimeFilterChange({ period });
    }
  };

  const handleCustomDateChange = (startDate: string, endDate: string) => {
    onTimeFilterChange({
      period: 'custom',
      startDate,
      endDate
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Advanced Filters</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time Period Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Time Period
          </label>
          <div className="flex flex-wrap gap-2">
            {(['week', 'month', 'season', 'custom'] as const).map((period) => (
              <button
                key={period}
                onClick={() => handleTimePeriodChange(period)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  currentTimeFilter.period === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>

          {/* Custom Date Picker */}
          {showCustomDatePicker && (
            <div className="mt-3 p-3 bg-gray-700 rounded">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={currentTimeFilter.startDate || ''}
                    onChange={(e) => handleCustomDateChange(e.target.value, currentTimeFilter.endDate || '')}
                    className="w-full px-2 py-1 bg-gray-600 text-white rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">End Date</label>
                  <input
                    type="date"
                    value={currentTimeFilter.endDate || ''}
                    onChange={(e) => handleCustomDateChange(currentTimeFilter.startDate || '', e.target.value)}
                    className="w-full px-2 py-1 bg-gray-600 text-white rounded text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Normalization Options */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Normalization
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={currentNormalization.perPlayer}
                onChange={(e) => onNormalizationChange({
                  ...currentNormalization,
                  perPlayer: e.target.checked
                })}
                className="mr-2"
              />
              <span className="text-sm text-gray-300">Per Player</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={currentNormalization.perFlight}
                onChange={(e) => onNormalizationChange({
                  ...currentNormalization,
                  perFlight: e.target.checked
                })}
                className="mr-2"
              />
              <span className="text-sm text-gray-300">Per Flight</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={currentNormalization.perDay}
                onChange={(e) => onNormalizationChange({
                  ...currentNormalization,
                  perDay: e.target.checked
                })}
                className="mr-2"
              />
              <span className="text-sm text-gray-300">Per Day</span>
            </label>
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="text-sm text-gray-400">
          <span className="font-medium">Active Filters:</span>
          <span className="ml-2">
            Period: {currentTimeFilter.period}
            {currentTimeFilter.startDate && currentTimeFilter.endDate && (
              <span> ({currentTimeFilter.startDate} to {currentTimeFilter.endDate})</span>
            )}
          </span>
          {(currentNormalization.perPlayer || currentNormalization.perFlight || currentNormalization.perDay) && (
            <span className="ml-4">
              Normalized by: {[
                currentNormalization.perPlayer && 'Player',
                currentNormalization.perFlight && 'Flight',
                currentNormalization.perDay && 'Day'
              ].filter(Boolean).join(', ')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
