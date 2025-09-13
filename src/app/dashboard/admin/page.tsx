'use client';

import React, { useMemo, useState } from 'react';
import { mockAllianceData } from '@/lib/mockData';
import type { AllianceData } from '@/types';
import { ALLIANCES, type AllianceKey, computePlayerStats, getHeatmapRows, getPipeline, getDemotionRisks, getOptimizationCandidates } from '@/lib/metrics';

type RangeKey = '7' | '30' | '90';

export default function AdminDashboard() {
  const [range, setRange] = useState<RangeKey>('30');

  const endDateISO = useMemo(() => {
    return mockAllianceData.reduce<string>((acc, r: AllianceData) => (acc > r.entry_date ? acc : r.entry_date), '1970-01-01');
  }, []);

  const filtered = useMemo(() => {
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
  const pipeline = useMemo(() => getPipeline(stats), [stats]);
  const demotionRisks = useMemo(() => getDemotionRisks(stats), [stats]);
  const optimizations = useMemo(() => getOptimizationCandidates(filtered), [filtered]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-300">Range</label>
        <select value={range} onChange={e => setRange(e.target.value as RangeKey)} className="bg-gray-900 border border-gray-700 rounded px-3 py-2">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
        <div className="text-xs text-gray-400 ml-auto">Data through <span className="font-medium text-gray-200">{endDateISO}</span></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl p-4 border border-gray-800 bg-gray-900">
          <div className="text-sm mb-2 text-gray-300">Promotion Pipeline Count</div>
          <table className="w-full text-sm">
            <thead className="text-gray-400">
              <tr><th className="text-left py-2">Alliance</th><th className="text-center">7D Ready</th><th className="text-center">30D Ready</th></tr>
            </thead>
            <tbody>
              {(ALLIANCES as readonly AllianceKey[]).map(a => (
                <tr key={a} className="border-t border-gray-800">
                  <td className="py-2">{a.toUpperCase()}</td>
                  <td className="text-center">{pipeline[a].ready7d}</td>
                  <td className="text-center">{pipeline[a].ready30d}</td>
                </tr>
              ))}
              <tr className="border-t border-gray-800 font-semibold">
                <td className="py-2">TOTAL</td>
                <td className="text-center">{(ALLIANCES as readonly AllianceKey[]).reduce((s,a)=>s+pipeline[a].ready7d,0)}</td>
                <td className="text-center">{(ALLIANCES as readonly AllianceKey[]).reduce((s,a)=>s+pipeline[a].ready30d,0)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="rounded-xl p-4 border border-gray-800 bg-gray-900 lg:col-span-2">
          <div className="text-sm mb-2 text-gray-300">Recruitment Heatmap — % ≥ Requirement</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr><th className="text-left py-2">Alliance</th><th className="text-center">3D</th><th className="text-center">7D</th><th className="text-center">30D</th></tr>
              </thead>
              <tbody>
                {heat.map(r => (
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl p-4 border border-gray-800 bg-gray-900">
          <div className="text-sm mb-3 text-gray-300">Demotion Risks (below 7d/30d)</div>
          <div className="max-h-72 overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr><th className="text-left py-2">Player</th><th className="text-left">Alliance</th><th className="text-left">Reason</th></tr>
              </thead>
              <tbody>
                {demotionRisks.length === 0 ? (
                  <tr><td colSpan={3} className="text-center text-gray-500 py-6">No risks in range</td></tr>
                ) : (
                  demotionRisks.map((r, idx) => (
                    <tr key={idx} className="border-t border-gray-800">
                      <td className="py-2">{r.player_name}</td>
                      <td className="py-2">{r.alliance_name.toUpperCase()}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs ${r.reason==='both'?'bg-red-600 text-white': r.reason==='below_30d'?'bg-yellow-600 text-white':'bg-gray-600 text-white'}`}>
                          {r.reason.replace('_',' ').toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl p-4 border border-gray-800 bg-gray-900">
          <div className="text-sm mb-3 text-gray-300">Optimization Candidates (low revenue/flight)</div>
          <div className="max-h-72 overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr><th className="text-left py-2">Player</th><th className="text-left">Alliance</th><th className="text-right">Flights</th><th className="text-right">Revenue/Flight</th></tr>
              </thead>
              <tbody>
                {optimizations.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-gray-500 py-6">No candidates in range</td></tr>
                ) : (
                  optimizations.map((o, idx) => (
                    <tr key={idx} className="border-t border-gray-800">
                      <td className="py-2">{o.player_name}</td>
                      <td className="py-2">{o.alliance_name.toUpperCase()}</td>
                      <td className="py-2 text-right">{o.flights.toLocaleString()}</td>
                      <td className="py-2 text-right">${o.revenuePerFlight.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
