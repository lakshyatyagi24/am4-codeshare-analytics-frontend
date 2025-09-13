'use client';

import AllianceOverview from '../components/AllianceOverview';
import Link from 'next/link';

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
            <div className="mt-2 flex gap-2 justify-end">
              <Link className="text-sm text-sky-400 underline" href="/dashboard/player">Open Player Dashboard</Link>
              <span className="text-gray-600">|</span>
              <Link className="text-sm text-sky-400 underline" href="/dashboard/admin">Open Admin Dashboard</Link>
            </div>
          </div>
        </header>

        <AllianceOverview />
      </div>
    </div>
  );
}

