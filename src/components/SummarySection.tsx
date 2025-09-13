import React from 'react';

interface SummaryCardProps {
  icon: string;
  value: string | number;
  label: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ icon, value, label }) => (
  <div className="summary-card cursor-pointer hover:bg-gray-700 transition-colors relative">
    <div className="summary-icon">{icon}</div>
    <div className="summary-content">
      <div className="summary-value">{value}</div>
      <div className="summary-label">{label}</div>
    </div>
  </div>
);

interface SummarySectionProps {
  totalFlights: number;
  totalRevenue: number;
  totalPlayers: number;
  avgEngagement: number;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  totalFlights,
  totalRevenue,
  totalPlayers,
  avgEngagement
}) => (
  <div className="summary-section">
    <div className="summary-grid">
      <SummaryCard
        icon="✈️"
        value={totalFlights.toLocaleString()}
        label="Total Flights"
      />
      <SummaryCard
        icon="💰"
        value={`$${totalRevenue.toLocaleString()}`}
        label="Total Revenue"
      />
      <SummaryCard
        icon="👥"
        value={totalPlayers}
        label="Total Players"
      />
      <SummaryCard
        icon="📈"
        value={avgEngagement.toFixed(1)}
        label="Avg Engagement"
      />
    </div>
  </div>
);
