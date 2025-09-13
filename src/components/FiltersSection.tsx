import React from 'react';
import AdvancedFilters from './AdvancedFilters';
import type { TimeFilter, NormalizationOptions } from '../types';

interface FiltersSectionProps {
  onTimeFilterChange: (filter: TimeFilter) => void;
  onNormalizationChange: (options: NormalizationOptions) => void;
  currentTimeFilter: TimeFilter;
  currentNormalization: NormalizationOptions;
}

export const FiltersSection: React.FC<FiltersSectionProps> = ({
  onTimeFilterChange,
  onNormalizationChange,
  currentTimeFilter,
  currentNormalization
}) => (
  <div className="mt-8">
    <AdvancedFilters
      onTimeFilterChange={onTimeFilterChange}
      onNormalizationChange={onNormalizationChange}
      currentTimeFilter={currentTimeFilter}
      currentNormalization={currentNormalization}
    />
  </div>
);
