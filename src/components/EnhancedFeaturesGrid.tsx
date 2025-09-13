import React from 'react';
import ContributorTable from './ContributorTable';
import ContributionHeatmap from './ContributionHeatmap';
import type { ContributorData, HeatmapData } from '../types';

interface EnhancedFeaturesGridProps {
  contributorData: ContributorData[];
  heatmapData: HeatmapData[];
}

export const EnhancedFeaturesGrid: React.FC<EnhancedFeaturesGridProps> = ({
  contributorData,
  heatmapData
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
    <ContributorTable data={contributorData} title="Top Contributors & Activity" />
    <ContributionHeatmap data={heatmapData} title="Contribution Distribution Heatmap" />
  </div>
);
