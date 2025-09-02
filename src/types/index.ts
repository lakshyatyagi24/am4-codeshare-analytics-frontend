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
}
