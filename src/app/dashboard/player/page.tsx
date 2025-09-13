'use client';

import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import MiniSparkline from '@/components/MiniSparkline';
import { mockAllianceData } from '@/lib/mockData';
import type { AllianceData } from '@/types';
import { ALLIANCES, type AllianceKey, computePlayerStats, getDonut, getHeatmapRows, getTopWorst, uniqueMembersByAlliance } from '@/lib/metrics';

type RangeKey = '7' | '30' | '90';

const zoneGuess = () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

export default function PlayerDashboard() {
  const [range, setRange] = useState<RangeKey>('30');
  const [tz, setTz] = useState<string>(zoneGuess());

  const endDateISO = useMemo<string>(() => {
    // Use max date in mock as "today" to stay deterministic
    const max = mockAllianceData.reduce<string>((acc, r: AllianceData) => (acc > r.entry_date ? acc : r.entry_date), '1970-01-01');
    return max;
  }, []);

  const filtered: AllianceData[] = useMemo(() => {
    const end = new Date(endDateISO + 'T00:00:00Z');
    const days = parseInt(range, 10);
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - (days - 1));
    return mockAllianceData.filter((r: AllianceData) => {
      const d = new Date(`${r.entry_date}T00:00:00Z`);
      return d >= start && d <= end;
    });
  }, [range, endDateISO]);

  const stats = useMemo(() => computePlayerStats(filtered, endDateISO), [filtered, endDateISO]);
  const heat = useMemo(() => getHeatmapRows(stats), [stats]);
  const membersCount = useMemo(() => uniqueMembersByAlliance(filtered), [filtered]);

  // Simple timeline aggregated by alliance by date (for the line chart)
  type TimelineRow = { date: string } & Record<`${AllianceKey}_contrib`, number>;
  const timeline = useMemo<TimelineRow[]>(() => {
    // collect unique dates sorted asc
    const dates = Array.from(new Set(filtered.map((r: AllianceData) => r.entry_date))).sort();
    return dates.map((date): TimelineRow => {
      const row = { date } as TimelineRow;
      for (const a of ALLIANCES as readonly AllianceKey[]) {
        const items = filtered.filter((x: AllianceData) => x.entry_date === date && x.alliance_name === a);
        row[`${a}_contrib`] = items.reduce((s, x) => s + x.contributed, 0);
      }
      return row;
    });
  }, [filtered]);

  // per-alliance sparkline data (last up to 7 points)
  const COLORS = ['#00d4ff', '#ff6b6b', '#4ecdc4', '#ffa726'];
  const sparks = useMemo(() => {
    const m: Record<string, number[]> = {};
    for (const a of ALLIANCES) {
      m[a] = timeline.map((r) => (r[`${a}_contrib` as keyof TimelineRow] as number) || 0).slice(-7);
    }
    return m;
  }, [timeline]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-gray-300">Range</label>
        <select value={range} onChange={e => setRange(e.target.value as RangeKey)} className="bg-gray-900 border border-gray-700 rounded px-3 py-2">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
        <label className="text-sm text-gray-300 ml-4">Timezone</label>
        <select value={tz} onChange={e => setTz(e.target.value)} className="bg-gray-900 border border-gray-700 rounded px-3 py-2">
          <option value={zoneGuess()}>Auto ({zoneGuess()})</option>
          <option value="UTC">UTC</option>
        </select>
        <div className="text-xs text-gray-400 ml-auto">Data through <span className="font-medium text-gray-200">{endDateISO}</span></div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  {ALLIANCES.map((a: AllianceKey, i: number) => (
          <div key={a} className="rounded-xl p-4 border border-gray-800 bg-gray-900">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase text-gray-400">{a}</div>
              <div className="text-xs text-gray-400">Members</div>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="text-2xl font-semibold">{membersCount[a].toLocaleString()}</div>
              <div className="flex-1">
                <MiniSparkline data={sparks[a]} color={COLORS[i % COLORS.length]} height={36} showTooltip={false} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trend chart */}
      <div className="rounded-xl p-4 border border-gray-800 bg-gray-900">
        <div className="text-sm mb-2 text-gray-300">Contribution Trends</div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" tick={{ fill: '#94a3b8' }} />
            <YAxis tick={{ fill: '#94a3b8' }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1f2937' }} />
            <Legend />
            {ALLIANCES.map((a: AllianceKey, i: number) => (
              <Line key={a} type="monotone" dataKey={`${a}_contrib`} name={a.toUpperCase()} stroke={["#00d4ff","#00E5FF","#9B59B6","#1ABC9C"][i]} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Donut charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ALLIANCES.map((a: AllianceKey) => {
          const d = getDonut(stats, a);
          const pie = [
            { name: 'Rising', value: d.rising, color: '#22c55e' },
            { name: 'Stable', value: d.stable, color: '#eab308' },
            { name: 'Dropping', value: d.dropping, color: '#ef4444' }
          ];
          return (
            <div key={a} className="rounded-xl p-4 border border-gray-800 bg-gray-900">
              <div className="text-sm mb-2 text-gray-300">{a.toUpperCase()} — Trend Distribution</div>
              <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} label>
                      {pie.map((seg, idx) => (
                        <Cell key={idx} fill={seg.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#0f172a', border: '1px solid #1f2937' }}
                      formatter={(value: number | string, name: string) => [`${value}%`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>

      {/* Heatmap table */}
      <div className="rounded-xl p-4 border border-gray-800 bg-gray-900">
        <div className="text-sm mb-2 text-gray-300">Recruitment Heatmap — % ≥ Requirement</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-400">
              <tr><th className="text-left py-2">Alliance</th><th>3D</th><th>7D</th><th>30D</th></tr>
            </thead>
            <tbody>
              {heat.map((r) => (
                <tr key={r.alliance} className="border-t border-gray-800">
                  <td className="py-2">{r.alliance.toUpperCase()}</td>
                  <td className="text-center">{r.pct3d}%</td>
                  <td className="text-center">{r.pct7d}%</td>
                  <td className="text-center">{r.pct30d}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top/Worst grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ALLIANCES.map((a: AllianceKey) => {
          const tw = getTopWorst(stats, a);
          return (
            <div key={a} className="rounded-xl p-4 border border-gray-800 bg-gray-900">
              <div className="text-sm mb-2 text-gray-300">{a.toUpperCase()} — Top 5 (Avg CPD 7d)</div>
              <ol className="list-decimal list-inside text-sm mb-4">
                {tw.top5.map((it) => <li key={it.name} className="flex justify-between"><span>{it.name}</span><span>{it.value}</span></li>)}
              </ol>
              <div className="text-sm mb-2 text-gray-300">{a.toUpperCase()} — Worst 5</div>
              <ol className="list-decimal list-inside text-sm">
                {tw.worst5.map((it) => <li key={it.name} className="flex justify-between"><span>{it.name}</span><span>{it.value}</span></li>)}
              </ol>
            </div>
          );
        })}
      </div>
    </div>
  );
}
