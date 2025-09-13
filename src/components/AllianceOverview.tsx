'use client';

import { useState } from 'react';
import type { DrilldownData, ContributorData, AnomalyAlert, AuditLog, HeatmapData, TimeFilter, NormalizationOptions, AllianceDetailView } from '../types';
import MetricDrilldownModal from './MetricDrilldownModal';
import AllianceDetailModal from './AllianceDetailModal';

// Import new modular components
import { SummarySection } from './SummarySection';
import { TrendsChart } from './TrendsChart';
import { AllianceGrid } from './AllianceGrid';
import { ShareDistributionChart } from './ShareDistributionChart';
import { EnhancedFeaturesGrid } from './EnhancedFeaturesGrid';
import { AlertsSection } from './AlertsSection';
import { AuditSection } from './AuditSection';
import { FiltersSection } from './FiltersSection';
import { ExportSection } from './ExportSection';

// Import custom hook
import { useAllianceData } from '../hooks/useAllianceData';

// Import mock data
import {
  mockAllianceData
} from '../lib/mockData';

export default function AllianceOverview() {
  // Use custom hook for data processing
  const { data, trendData, loading } = useAllianceData(mockAllianceData);

  // New state for enhanced features
  const [contributorData] = useState<ContributorData[]>([]);
  const [anomalyAlerts, setAnomalyAlerts] = useState<AnomalyAlert[]>([]);
  const [auditLogs] = useState<AuditLog[]>([]);
  const [heatmapData] = useState<HeatmapData[]>([]);

  // Modal states
  const [drilldownModal, setDrilldownModal] = useState<{
    isOpen: boolean;
    title: string;
    data: DrilldownData[];
  }>({
    isOpen: false,
    title: '',
    data: []
  });

  const [allianceDetailModal, setAllianceDetailModal] = useState<{
    isOpen: boolean;
    alliance: AllianceDetailView | null;
  }>({
    isOpen: false,
    alliance: null
  });

  // Filter states
  const [timeFilter, setTimeFilter] = useState<TimeFilter>({ period: 'month' });
  const [normalization, setNormalization] = useState<NormalizationOptions>({ perPlayer: false, perFlight: false, perDay: false });

  const handleAllianceClick = (allianceName: string) => {
    const mockAllianceDetail: AllianceDetailView = {
      alliance_name: allianceName,
      top_contributors: [],
      new_joiners: [],
      inactive_users: [],
      retention_rate: 85,
      cohort_data: [],
      recent_activity: [
        { alliance_name: allianceName, date: '2024-01-15', value: 1000, change: 2.5, trend: 'up' },
        { alliance_name: allianceName, date: '2024-01-14', value: 5000, change: -1.2, trend: 'down' },
      ]
    };
    setAllianceDetailModal({
      isOpen: true,
      alliance: mockAllianceDetail
    });
  };

  const handleCloseDrilldown = () => {
    setDrilldownModal({ isOpen: false, title: '', data: [] });
  };

  const handleCloseAllianceDetail = () => {
    setAllianceDetailModal({ isOpen: false, alliance: null });
  };

  const handleDismissAlert = (alertId: string) => {
    setAnomalyAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleTimeFilterChange = (filter: TimeFilter) => {
    setTimeFilter(filter);
  };

  const handleNormalizationChange = (option: NormalizationOptions) => {
    setNormalization(option);
  };

  const handleExport = (options: { format: 'csv' | 'png'; includeCharts: boolean; includeTables: boolean; dateRange: TimeFilter; selectedAlliances: string[] }) => {
    console.log(`Exporting ${options.format} for alliances:`, options.selectedAlliances);
    // Mock export functionality
  };

  if (loading) {
    return <div className="loading">Loading alliance data...</div>;
  }

  // Calculate summary metrics
  const totalFlights = data.reduce((sum, alliance) => sum + alliance.total_contributed, 0);
  const totalRevenue = data.reduce((sum, alliance) => sum + alliance.mtd_contributed, 0);
  const totalPlayers = data.reduce((sum, alliance) => sum + alliance.total_players, 0);
  const avgEngagement = data.reduce((sum, alliance) => sum + alliance.engagement_score, 0) / data.length;

  return (
    <div className="alliance-analytics-container">
      <SummarySection
        totalFlights={totalFlights}
        totalRevenue={totalRevenue}
        totalPlayers={totalPlayers}
        avgEngagement={avgEngagement}
      />

      <TrendsChart
        trendData={trendData}
        data={data}
      />

      <AllianceGrid
        data={data}
        onAllianceClick={handleAllianceClick}
      />

      <ShareDistributionChart
        data={data}
      />

      <EnhancedFeaturesGrid
        contributorData={contributorData}
        heatmapData={heatmapData}
      />

      <AlertsSection
        alerts={anomalyAlerts}
        onDismissAlert={handleDismissAlert}
      />

      <AuditSection
        logs={auditLogs}
      />

      <FiltersSection
        onTimeFilterChange={handleTimeFilterChange}
        onNormalizationChange={handleNormalizationChange}
        currentTimeFilter={timeFilter}
        currentNormalization={normalization}
      />

      <ExportSection
        onExport={handleExport}
        availableAlliances={data.map(a => a.alliance_name)}
      />

      {/* Drilldown Modal */}
      <MetricDrilldownModal
        isOpen={drilldownModal.isOpen}
        onClose={handleCloseDrilldown}
        title={drilldownModal.title}
        data={drilldownModal.data}
      />

      {/* Alliance Detail Modal */}
      {allianceDetailModal.alliance && (
        <AllianceDetailModal
          alliance={allianceDetailModal.alliance}
          isOpen={allianceDetailModal.isOpen}
          onClose={handleCloseAllianceDetail}
        />
      )}
    </div>
  );
}
