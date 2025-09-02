'use client';

import { useState, useEffect } from 'react';
import { AllianceData } from '../types';
import type { AllianceOverview } from '../types';

// Mock data - replace with actual API call
const mockData: AllianceData[] = [
  {
    entry_date: '2025-09-02',
    player_name: 'John Doe',
    share: 15.75,
    contributed: 20000,
    contribution_per_day: 500,
    joined: '2024-03-12',
    flights: 120,
    online: true,
    season: 'Summer 2025',
    ytd_average: 230,
    alliance_name: 'codeshare'
  },
  {
    entry_date: '2025-09-02',
    player_name: 'Jane Smith',
    share: 20.5,
    contributed: 30000,
    contribution_per_day: 800,
    joined: '2023-11-20',
    flights: 210,
    online: false,
    season: 'Summer 2025',
    ytd_average: 315,
    alliance_name: 'codeshare'
  },
  {
    entry_date: '2025-09-02',
    player_name: 'Bob Wilson',
    share: 18.2,
    contributed: 25000,
    contribution_per_day: 600,
    joined: '2024-01-15',
    flights: 180,
    online: true,
    season: 'Summer 2025',
    ytd_average: 280,
    alliance_name: 'exoshare'
  },
  {
    entry_date: '2025-09-02',
    player_name: 'Alice Brown',
    share: 22.1,
    contributed: 35000,
    contribution_per_day: 900,
    joined: '2023-08-10',
    flights: 250,
    online: true,
    season: 'Summer 2025',
    ytd_average: 320,
    alliance_name: 'exoshare'
  },
  {
    entry_date: '2025-09-02',
    player_name: 'Charlie Davis',
    share: 16.8,
    contributed: 22000,
    contribution_per_day: 550,
    joined: '2024-05-20',
    flights: 150,
    online: false,
    season: 'Summer 2025',
    ytd_average: 260,
    alliance_name: 'thermoshare'
  },
  {
    entry_date: '2025-09-02',
    player_name: 'Diana Evans',
    share: 19.3,
    contributed: 28000,
    contribution_per_day: 700,
    joined: '2023-12-05',
    flights: 200,
    online: true,
    season: 'Summer 2025',
    ytd_average: 290,
    alliance_name: 'stratoshare'
  }
];

export default function AllianceOverview() {
  const [data, setData] = useState<AllianceOverview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      // In real app: const response = await fetch('/api/alliance-data');
      // const apiData: AllianceData[] = await response.json();

      const apiData = mockData;

      // Group by alliance
      const allianceGroups = apiData.reduce((acc, item) => {
        if (!acc[item.alliance_name]) {
          acc[item.alliance_name] = [];
        }
        acc[item.alliance_name].push(item);
        return acc;
      }, {} as Record<string, AllianceData[]>);

      // Compute overview for each alliance
      const overview: AllianceOverview[] = Object.entries(allianceGroups).map(([alliance, items]) => {
        const total_flights = items.reduce((sum, item) => sum + item.flights, 0);
        const total_contributed = items.reduce((sum, item) => sum + item.contributed, 0);
        const active_partners = items.filter(item => item.online).length;
        const avg_share = items.reduce((sum, item) => sum + item.share, 0) / items.length;
        const avg_ytd = items.reduce((sum, item) => sum + item.ytd_average, 0) / items.length;

        // For growth, assuming previous month data is 90% of current (mock)
        const month_growth_flights = 10; // +10%
        const month_growth_contributed = 12; // +12%

        // Engagement score based on avg ytd and active partners
        const engagement_score = (avg_ytd / 300) * 100 + (active_partners / items.length) * 20;

        return {
          alliance_name: alliance,
          total_flights,
          total_contributed,
          active_partners,
          avg_share,
          avg_ytd,
          month_growth_flights,
          month_growth_contributed,
          engagement_score
        };
      });

      setData(overview);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Calculate totals for summary
  const totalFlights = data.reduce((sum, alliance) => sum + alliance.total_flights, 0);
  const totalRevenue = data.reduce((sum, alliance) => sum + alliance.total_contributed, 0);
  const totalActivePartners = data.reduce((sum, alliance) => sum + alliance.active_partners, 0);
  const avgEngagement = data.length > 0 ? data.reduce((sum, alliance) => sum + alliance.engagement_score, 0) / data.length : 0;

  if (loading) {
    return (
      <div className="panel loading-panel">
        <div className="loading-spinner"></div>
        <div>Loading Alliance Analytics...</div>
      </div>
    );
  }

  return (
    <div className="alliance-analytics-container">
      {/* Summary Section */}
      <div className="summary-section">
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-icon">✈️</div>
            <div className="summary-content">
              <div className="summary-value">{totalFlights.toLocaleString()}</div>
              <div className="summary-label">Total Flights</div>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">💰</div>
            <div className="summary-content">
              <div className="summary-value">${totalRevenue.toLocaleString()}</div>
              <div className="summary-label">Total Revenue</div>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">👥</div>
            <div className="summary-content">
              <div className="summary-value">{totalActivePartners}</div>
              <div className="summary-label">Active Partners</div>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">📈</div>
            <div className="summary-content">
              <div className="summary-value">{avgEngagement.toFixed(1)}</div>
              <div className="summary-label">Avg Engagement</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alliance Details */}
      <div className="alliance-details-section">
        <h2 className="section-title">Alliance Performance</h2>
        <div className="alliance-grid">
          {data.map((alliance) => (
            <div key={alliance.alliance_name} className="alliance-card">
              <div className="alliance-header">
                <h3 className="alliance-name">{alliance.alliance_name.toUpperCase()}</h3>
                <div className="alliance-badge">
                  {alliance.engagement_score > 80 ? '🏆' : alliance.engagement_score > 60 ? '⭐' : '📊'}
                </div>
              </div>

              <div className="alliance-metrics">
                <div className="metric-group">
                  <div className="metric-item">
                    <div className="metric-icon">🛫</div>
                    <div className="metric-content">
                      <div className="metric-value">{alliance.total_flights}</div>
                      <div className="metric-label">Flights</div>
                      <div className={`metric-change ${alliance.month_growth_flights >= 0 ? 'positive' : 'negative'}`}>
                        {alliance.month_growth_flights >= 0 ? '+' : ''}{alliance.month_growth_flights}%
                      </div>
                    </div>
                  </div>

                  <div className="metric-item">
                    <div className="metric-icon">💵</div>
                    <div className="metric-content">
                      <div className="metric-value">${alliance.total_contributed.toLocaleString()}</div>
                      <div className="metric-label">Revenue</div>
                      <div className={`metric-change ${alliance.month_growth_contributed >= 0 ? 'positive' : 'negative'}`}>
                        {alliance.month_growth_contributed >= 0 ? '+' : ''}{alliance.month_growth_contributed}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="metric-group">
                  <div className="metric-item">
                    <div className="metric-icon">👤</div>
                    <div className="metric-content">
                      <div className="metric-value">{alliance.active_partners}</div>
                      <div className="metric-label">Active</div>
                    </div>
                  </div>

                  <div className="metric-item">
                    <div className="metric-icon">📊</div>
                    <div className="metric-content">
                      <div className="metric-value">{alliance.avg_share.toFixed(1)}%</div>
                      <div className="metric-label">Avg Share</div>
                    </div>
                  </div>
                </div>

                <div className="engagement-bar">
                  <div className="engagement-label">Engagement Score</div>
                  <div className="engagement-progress">
                    <div
                      className="engagement-fill"
                      style={{ width: `${Math.min(alliance.engagement_score, 100)}%` }}
                    ></div>
                  </div>
                  <div className="engagement-value">{alliance.engagement_score.toFixed(1)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
