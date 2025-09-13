export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  // Add more fields as needed
}

export interface AllianceData {
  entry_date: string;
  player_name: string;
  share: number;
  contributed: number;
  contribution_per_day: number;
  joined: string;
  flights: number;
  online: boolean;
  season: string;
  ytd_average: number;
  alliance_name: string;
}

export interface AllianceOverview {
  alliance_name: string;
  total_flights: number;
  total_contributed: number;
  active_partners: number;
  avg_share: number;
  avg_ytd: number;
  month_growth_flights: number;
  month_growth_contributed: number;
  engagement_score: number;
  total_players: number;
  new_joins: number;
  activity_rate: number;
  mtd_contributed: number;
  ytd_contributed: number;
  total_share: number;
}

// New types for enhanced features
export interface DrilldownData {
  alliance_name: string;
  date: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ContributorData {
  player_name: string;
  alliance_name: string;
  contributed: number;
  flights: number;
  share: number;
  joined: string;
  last_active: string;
  status: 'active' | 'inactive' | 'new';
}

export interface AnomalyAlert {
  id: string;
  type: 'spike' | 'dip' | 'anomaly';
  alliance_name: string;
  player_name?: string;
  metric: string;
  value: number;
  threshold: number;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: 'update' | 'create' | 'delete' | 'alert';
  user: string;
  details: string;
  status: 'success' | 'warning' | 'error';
  alliance_name?: string;
  player_name?: string;
}

export interface HeatmapData {
  alliance_name: string;
  player_name: string;
  contribution: number;
  intensity: number; // 0-1 scale for heatmap coloring
}

export interface MetricSummary {
  title: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  color: string;
  sparklineData?: number[]; // Last 7 days data for mini sparkline
}

// Advanced filtering types
export interface TimeFilter {
  period: 'week' | 'month' | 'season' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface NormalizationOptions {
  perPlayer: boolean;
  perFlight: boolean;
  perDay: boolean;
}

// Cohort analysis types
export interface CohortData {
  join_date: string;
  season: string;
  players: number;
  active_after_1_week: number;
  active_after_1_month: number;
  active_after_3_months: number;
  retention_rate_1w: number;
  retention_rate_1m: number;
  retention_rate_3m: number;
}

export interface AllianceDetailView {
  alliance_name: string;
  top_contributors: ContributorData[];
  new_joiners: ContributorData[];
  inactive_users: ContributorData[];
  retention_rate: number;
  cohort_data: CohortData[];
  recent_activity: DrilldownData[];
}

// Data audit types
export interface DataAudit {
  last_update: string;
  missing_data_alerts: {
    alliance: string;
    missing_fields: string[];
    severity: 'low' | 'medium' | 'high';
  }[];
  duplicate_checks: {
    table: string;
    duplicates_found: number;
    resolved: boolean;
  }[];
  data_quality_score: number;
}

// Export types
export interface ExportOptions {
  format: 'csv' | 'png';
  includeCharts: boolean;
  includeTables: boolean;
  dateRange: TimeFilter;
  selectedAlliances: string[];
}
