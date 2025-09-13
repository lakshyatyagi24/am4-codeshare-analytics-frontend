import React from 'react';
import ExportWidget from './ExportWidget';
import type { TimeFilter } from '../types';

interface ExportSectionProps {
  onExport: (options: { format: 'csv' | 'png'; includeCharts: boolean; includeTables: boolean; dateRange: TimeFilter; selectedAlliances: string[] }) => void;
  availableAlliances: string[];
}

export const ExportSection: React.FC<ExportSectionProps> = ({ onExport, availableAlliances }) => (
  <div className="mt-8">
    <ExportWidget
      onExport={onExport}
      availableAlliances={availableAlliances}
    />
  </div>
);
