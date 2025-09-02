'use client';

import AllianceOverview from '../components/AllianceOverview';

export default function Dashboard() {
  return (
    <div className="min-h-screen text-white dashboard-wrap">
      <div className="container">
        <header className="dashboard-header">
          <div>
            <div className="dashboard-title">Alliance Overview Analytics</div>
            <div style={{ color: 'var(--foreground)', fontSize: 13 }}>September 2, 2025</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#94a3b8' }}>Live Data <span className="live-dot" aria-hidden /></div>
          </div>
        </header>

        <AllianceOverview />
      </div>
    </div>
  );
}

