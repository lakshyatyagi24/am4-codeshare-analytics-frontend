import { AllianceData } from '../types';

// Alliance keys used across UI
export const ALLIANCES = ['codeshare', 'exoshare', 'thermoshare', 'stratoshare'] as const;
export type AllianceKey = typeof ALLIANCES[number];

export type Trend = 'rising' | 'stable' | 'dropping';

export interface WindowConfig {
  days: number;
  // requirement threshold on average contribution_per_day within window
  minAvgCPD: number;
}

export const WINDOW_CONFIG: Record<'3d' | '7d' | '30d', WindowConfig> = {
  '3d': { days: 3, minAvgCPD: 500 },
  '7d': { days: 7, minAvgCPD: 600 },
  '30d': { days: 30, minAvgCPD: 550 }
};

export interface PlayerWindowStats {
  player_name: string;
  alliance_name: AllianceKey;
  avgCPD3d: number; // average contribution_per_day
  avgCPD7d: number;
  avgCPD30d: number;
  meets3d: boolean;
  meets7d: boolean;
  meets30d: boolean;
  trend7d: Trend; // based on compare of last 7d vs previous 7d
}

export interface HeatmapRow { alliance: AllianceKey; pct3d: number; pct7d: number; pct30d: number }
export interface Donut { rising: number; stable: number; dropping: number }
export interface PipelineCounts { ready7d: number; ready30d: number }
export interface TopWorstEntry { name: string; value: number }
export interface DemotionRiskEntry { player_name: string; alliance_name: AllianceKey; reason: 'below_7d' | 'below_30d' | 'both' }
export interface OptimizationCandidate { player_name: string; alliance_name: AllianceKey; flights: number; contributed: number; revenuePerFlight: number }

function parseISO(d: string): Date { return new Date(d + 'T00:00:00Z'); }

function inRange(date: Date, end: Date, days: number): boolean {
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  return date >= start && date <= end;
}

function avg(nums: number[]): number { return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0; }

export function computePlayerStats(
  data: AllianceData[],
  endDateISO: string
): PlayerWindowStats[] {
  const end = parseISO(endDateISO);
  // group by player within each alliance
  const byPlayer = new Map<string, AllianceData[]>();
  for (const row of data) {
    const k = `${row.alliance_name}__${row.player_name}`;
    if (!byPlayer.has(k)) byPlayer.set(k, []);
    byPlayer.get(k)!.push(row);
  }
  // sort each player's rows by date asc
  for (const rows of byPlayer.values()) rows.sort((a, b) => +parseISO(a.entry_date) - +parseISO(b.entry_date));

  const out: PlayerWindowStats[] = [];
  for (const [key, rows] of byPlayer.entries()) {
    const [alliance_name, player_name] = key.split('__') as [AllianceKey, string];

    const cpd3 = rows.filter(r => inRange(parseISO(r.entry_date), end, WINDOW_CONFIG['3d'].days)).map(r => r.contribution_per_day);
    const cpd7 = rows.filter(r => inRange(parseISO(r.entry_date), end, WINDOW_CONFIG['7d'].days)).map(r => r.contribution_per_day);
    const cpd30 = rows.filter(r => inRange(parseISO(r.entry_date), end, WINDOW_CONFIG['30d'].days)).map(r => r.contribution_per_day);

    const avgCPD3d = Math.round(avg(cpd3));
    const avgCPD7d = Math.round(avg(cpd7));
    const avgCPD30d = Math.round(avg(cpd30));

    const meets3d = avgCPD3d >= WINDOW_CONFIG['3d'].minAvgCPD;
    const meets7d = avgCPD7d >= WINDOW_CONFIG['7d'].minAvgCPD;
    const meets30d = avgCPD30d >= WINDOW_CONFIG['30d'].minAvgCPD;

    // trend: compare last 7d vs previous 7d window
    const prevEnd = new Date(end);
    prevEnd.setUTCDate(prevEnd.getUTCDate() - WINDOW_CONFIG['7d'].days);
    const prev7 = rows.filter(r => inRange(parseISO(r.entry_date), prevEnd, WINDOW_CONFIG['7d'].days)).map(r => r.contribution_per_day);
    const prevAvg = avg(prev7);
    let trend7d: Trend = 'stable';
    if (avgCPD7d && prevAvg) {
      const delta = ((avgCPD7d - prevAvg) / prevAvg) * 100;
      trend7d = delta > 5 ? 'rising' : delta < -5 ? 'dropping' : 'stable';
    } else if (avgCPD7d > 0 && prevAvg === 0) {
      trend7d = 'rising';
    } else if (avgCPD7d === 0 && prevAvg > 0) {
      trend7d = 'dropping';
    }

    out.push({ player_name, alliance_name, avgCPD3d, avgCPD7d, avgCPD30d, meets3d, meets7d, meets30d, trend7d });
  }
  return out;
}

export function getHeatmapRows(stats: PlayerWindowStats[]): HeatmapRow[] {
  const byAlliance = new Map<AllianceKey, PlayerWindowStats[]>();
  stats.forEach(s => {
    const k = s.alliance_name;
    if (!byAlliance.has(k)) byAlliance.set(k, []);
    byAlliance.get(k)!.push(s);
  });
  return ALLIANCES.map(a => {
    const arr = byAlliance.get(a) ?? [];
    const n = arr.length || 1;
    const pct3d = Math.round((arr.filter(x => x.meets3d).length / n) * 100);
    const pct7d = Math.round((arr.filter(x => x.meets7d).length / n) * 100);
    const pct30d = Math.round((arr.filter(x => x.meets30d).length / n) * 100);
    return { alliance: a, pct3d, pct7d, pct30d };
  });
}

export function getDonut(stats: PlayerWindowStats[], alliance: AllianceKey): Donut {
  const arr = stats.filter(s => s.alliance_name === alliance);
  const n = arr.length || 1;
  const rising = Math.round((arr.filter(s => s.trend7d === 'rising').length / n) * 100);
  const stable = Math.round((arr.filter(s => s.trend7d === 'stable').length / n) * 100);
  const dropping = 100 - rising - stable;
  return { rising, stable, dropping };
}

export function getPipeline(stats: PlayerWindowStats[]): Record<AllianceKey, PipelineCounts> {
  const res = {} as Record<AllianceKey, PipelineCounts>;
  for (const a of ALLIANCES) {
    const arr = stats.filter(s => s.alliance_name === a);
    res[a] = {
      ready7d: arr.filter(s => s.meets7d).length,
      ready30d: arr.filter(s => s.meets30d).length
    };
  }
  return res;
}

export function getTopWorst(stats: PlayerWindowStats[], alliance: AllianceKey) {
  const arr = stats.filter(s => s.alliance_name === alliance)
    .map(s => ({ name: s.player_name, value: s.avgCPD7d }))
    .sort((a, b) => b.value - a.value);
  return { top5: arr.slice(0, 5), worst5: [...arr].reverse().slice(0, 5) } as { top5: TopWorstEntry[]; worst5: TopWorstEntry[] };
}

export function uniqueMembersByAlliance(data: AllianceData[]): Record<AllianceKey, number> {
  const map: Record<AllianceKey, Set<string>> = {
    codeshare: new Set(), exoshare: new Set(), thermoshare: new Set(), stratoshare: new Set()
  };
  for (const r of data) {
    (map[r.alliance_name as AllianceKey] ?? new Set()).add(r.player_name);
  }
  const out: Record<AllianceKey, number> = {
    codeshare: map.codeshare.size,
    exoshare: map.exoshare.size,
    thermoshare: map.thermoshare.size,
    stratoshare: map.stratoshare.size
  };
  return out;
}

// Identify players who are below requirement thresholds for 7d/30d windows
export function getDemotionRisks(stats: PlayerWindowStats[]): DemotionRiskEntry[] {
  const risks: DemotionRiskEntry[] = [];
  for (const s of stats) {
    const below7 = !s.meets7d;
    const below30 = !s.meets30d;
    if (below7 || below30) {
      risks.push({
        player_name: s.player_name,
        alliance_name: s.alliance_name,
        reason: below7 && below30 ? 'both' : below7 ? 'below_7d' : 'below_30d'
      });
    }
  }
  // Sort: most severe first (both), then below_30d, then below_7d; within, alphabetical
  const rank = { both: 0, below_30d: 1, below_7d: 2 } as const;
  risks.sort((a, b) => (rank[a.reason] - rank[b.reason]) || a.alliance_name.localeCompare(b.alliance_name) || a.player_name.localeCompare(b.player_name));
  return risks;
}

// Suggest optimization candidates by low revenue per flight over the last 7 days
// We compute totals from raw data filtered elsewhere (caller should pass the same filtered slice used for stats)
export function getOptimizationCandidates(data: AllianceData[], alliance?: AllianceKey): OptimizationCandidate[] {
  // group by player
  const byPlayer = new Map<string, { alliance: AllianceKey; flights: number; contributed: number }>();
  for (const r of data) {
    if (alliance && r.alliance_name !== alliance) continue;
    const k = `${r.alliance_name}__${r.player_name}`;
    const curr = byPlayer.get(k) || { alliance: r.alliance_name as AllianceKey, flights: 0, contributed: 0 };
    curr.flights += r.flights;
    curr.contributed += r.contributed;
    byPlayer.set(k, curr);
  }
  const arr: OptimizationCandidate[] = [];
  for (const [k, v] of byPlayer.entries()) {
    const revenuePerFlight = v.flights > 0 ? v.contributed / v.flights : 0;
    const [a, player_name] = k.split('__') as [AllianceKey, string];
    arr.push({ player_name, alliance_name: a, flights: v.flights, contributed: v.contributed, revenuePerFlight: Math.round(revenuePerFlight) });
  }
  // Heuristic: filter to reasonably active flyers (e.g., >= 150 flights in the window) and sort ascending by revenuePerFlight
  return arr
    .filter(x => x.flights >= 150)
    .sort((a, b) => a.revenuePerFlight - b.revenuePerFlight)
    .slice(0, 20);
}
