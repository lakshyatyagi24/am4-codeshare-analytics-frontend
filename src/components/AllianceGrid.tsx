import React from 'react';
import type { AllianceOverview } from '../types';

interface AllianceCardProps {
  alliance: AllianceOverview;
  onClick: (allianceName: string) => void;
}

const AllianceCard: React.FC<AllianceCardProps> = ({ alliance, onClick }) => (
  <div
    key={alliance.alliance_name}
    className="alliance-card cursor-pointer hover:shadow-lg transition-all"
    onClick={() => onClick(alliance.alliance_name)}
  >
    <div className="alliance-header">
      <h3 className="alliance-name">{alliance.alliance_name.toUpperCase()}</h3>
      <div className="alliance-badge">
        {alliance.engagement_score > 80 ? '🏆' : alliance.engagement_score > 60 ? '⭐' : '📊'}
      </div>
    </div>

    <div className="alliance-metrics">
      {/* Key Performance Indicators */}
      <div className="metric-group">
        <div className="metric-item">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-value">${alliance.total_contributed.toLocaleString()}</div>
            <div className="metric-label">Today</div>
          </div>
        </div>
        <div className="metric-item">
          <div className="metric-icon">📅</div>
          <div className="metric-content">
            <div className="metric-value">${alliance.mtd_contributed.toLocaleString()}</div>
            <div className="metric-label">MTD</div>
          </div>
        </div>
        <div className="metric-item">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <div className="metric-value">${alliance.ytd_contributed.toLocaleString()}</div>
            <div className="metric-label">YTD</div>
          </div>
        </div>
      </div>

      {/* Share Metrics */}
      <div className="metric-group">
        <div className="metric-item">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <div className="metric-value">{alliance.avg_share.toFixed(1)}%</div>
            <div className="metric-label">Avg Share</div>
          </div>
        </div>
        <div className="metric-item">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <div className="metric-value">{alliance.total_share.toFixed(1)}%</div>
            <div className="metric-label">Total Share</div>
          </div>
        </div>
      </div>

      {/* Player Metrics */}
      <div className="metric-group">
        <div className="metric-item">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-value">{alliance.total_players}</div>
            <div className="metric-label">Players</div>
          </div>
        </div>
        <div className="metric-item">
          <div className="metric-icon">🆕</div>
          <div className="metric-content">
            <div className="metric-value">{alliance.new_joins}</div>
            <div className="metric-label">New Joins</div>
          </div>
        </div>
        <div className="metric-item">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <div className="metric-value">{alliance.activity_rate.toFixed(1)}%</div>
            <div className="metric-label">Activity Rate</div>
          </div>
        </div>
      </div>

      {/* YTD vs Current Period */}
      <div className="metric-group">
        <div className="metric-item">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <div className="metric-value">{alliance.avg_ytd.toFixed(1)}</div>
            <div className="metric-label">YTD Avg</div>
          </div>
        </div>
        <div className="metric-item">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <div className="metric-value">{(alliance.total_contributed / alliance.total_players / 30).toFixed(0)}</div>
            <div className="metric-label">Current Avg</div>
          </div>
        </div>
        <div className="metric-item">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <div className="metric-value">{alliance.month_growth_contributed.toFixed(1)}%</div>
            <div className="metric-label">Growth</div>
            <div className={`metric-change ${alliance.month_growth_contributed >= 0 ? 'positive' : 'negative'}`}>
              {alliance.month_growth_contributed >= 0 ? '+' : ''}{alliance.month_growth_contributed.toFixed(1)}%
            </div>
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
);

interface AllianceGridProps {
  data: AllianceOverview[];
  onAllianceClick: (allianceName: string) => void;
}

export const AllianceGrid: React.FC<AllianceGridProps> = ({ data, onAllianceClick }) => (
  <div className="alliance-details-section">
    <h2 className="section-title">Alliance Performance Overview</h2>
    <div className="alliance-grid">
      {data.map((alliance) => (
        <AllianceCard
          key={alliance.alliance_name}
          alliance={alliance}
          onClick={onAllianceClick}
        />
      ))}
    </div>
  </div>
);
