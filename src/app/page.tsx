'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const profitData = [
  { month: 'Jan', profit: 12000 },
  { month: 'Feb', profit: 15000 },
  { month: 'Mar', profit: 18000 },
  { month: 'Apr', profit: 22000 },
  { month: 'May', profit: 25000 },
  { month: 'Jun', profit: 28000 },
];

const codeshareData = [
  { name: 'Partner A', value: 35 },
  { name: 'Partner B', value: 25 },
  { name: 'Partner C', value: 20 },
  { name: 'Others', value: 20 },
];

const COLORS = ['#00d4ff', '#ff6b6b', '#4ecdc4', '#ffa726'];

export default function Dashboard() {
  return (
    <div className="min-h-screen text-white dashboard-wrap">
      <div className="container">
        <header className="dashboard-header">
          <div>
            <div className="dashboard-title">AM4 Alliance Analytics Dashboard</div>
            <div style={{ color: 'var(--foreground)', fontSize: 13 }}>Sunday, August 31, 2025 at 09:02:54 PM GMT+5:30</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#94a3b8' }}>Live Data <span className="live-dot" aria-hidden /></div>
          </div>
        </header>

        <div className="dashboard-grid">
          <main>
            <section className="panel">
              <div className="panel-title">Alliance Share Price Trends</div>
              <div style={{ height: 420 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={profitData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222729" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip contentStyle={{ backgroundColor: '#0b0c0d', border: 'none', color: '#fff' }} />
                    <Line type="monotone" dataKey="profit" stroke="#2563eb" strokeWidth={3} dot={{ r: 6, stroke: '#fff', strokeWidth: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 16 }}>
              <div className="panel stat-card">
                <div className="panel-title">Total Profit</div>
                <div style={{ fontSize: 22, color: '#34d399', fontWeight: 800 }}>$1,200,000</div>
                <div style={{ color: '#94a3b8', fontSize: 12 }}>+12% from last month</div>
              </div>
              <div className="panel stat-card">
                <div className="panel-title">Active Flights</div>
                <div style={{ fontSize: 22, color: '#60a5fa', fontWeight: 800 }}>247</div>
                <div style={{ color: '#94a3b8', fontSize: 12 }}>+5% from last week</div>
              </div>
            </div>

            <div style={{ marginTop: 16 }} className="panel">
              <div className="panel-title">Codeshare Distribution</div>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={codeshareData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                      {codeshareData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0b0c0d', border: 'none' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </main>

          <aside>
            <div className="panel">
              <div className="panel-title">Top 5 Companies by Alliance</div>
              <div className="sidebar-list">
                <div className="sidebar-group">
                  <h4>CODESHARE <span style={{ color: '#94a3b8', fontWeight: 400 }}>(59 members)</span></h4>
                  <div className="leader-item">
                    <div className="leader-left">
                      <div className="leader-name">Henry Air</div>
                      <div className="leader-meta">Top performer</div>
                    </div>
                    <div className="leader-right">
                      <div className="leader-price">$98.739</div>
                      <div className="pct-badge pct-up">+0.0%</div>
                    </div>
                  </div>
                  <div className="leader-item">
                    <div className="leader-left">
                      <div className="leader-name">DEADLY AIRLINES</div>
                      <div className="leader-meta">Market leader</div>
                    </div>
                    <div className="leader-right">
                      <div className="leader-price">$93.218</div>
                      <div className="pct-badge pct-up">+1.0%</div>
                    </div>
                  </div>
                  <div className="leader-item">
                    <div className="leader-left">
                      <div className="leader-name">XPTO</div>
                      <div className="leader-meta">Growing</div>
                    </div>
                    <div className="leader-right">
                      <div className="leader-price">$93.992</div>
                      <div className="pct-badge pct-down">-0.8%</div>
                    </div>
                  </div>
                </div>
                <div className="sidebar-group">
                  <h4>EXOSHARE <span style={{ color: '#94a3b8', fontWeight: 400 }}>(59 members)</span></h4>
                  <div className="leader-item">
                    <div className="leader-left">
                      <div className="leader-name">NEW FRANK AIRLINES</div>
                      <div className="leader-meta">Regional</div>
                    </div>
                    <div className="leader-right">
                      <div className="leader-price">$73.605</div>
                      <div className="pct-badge pct-up">+0.5%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

