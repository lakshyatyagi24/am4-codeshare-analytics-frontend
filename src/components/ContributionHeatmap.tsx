'use client';

import { useMemo } from 'react';
import { HeatmapData } from '../types';

interface ContributionHeatmapProps {
  data: HeatmapData[];
  title: string;
}

export default function ContributionHeatmap({ data, title }: ContributionHeatmapProps) {
  const { gridData, maxContribution, alliances } = useMemo(() => {
    const allianceMap = new Map<string, HeatmapData[]>();
    let maxContrib = 0;

    // Group data by alliance
    data.forEach(item => {
      if (!allianceMap.has(item.alliance_name)) {
        allianceMap.set(item.alliance_name, []);
      }
      allianceMap.get(item.alliance_name)!.push(item);
      maxContrib = Math.max(maxContrib, item.contribution);
    });

    // Sort alliances by total contribution
    const sortedAlliances = Array.from(allianceMap.entries())
      .sort(([, a], [, b]) =>
        b.reduce((sum, item) => sum + item.contribution, 0) -
        a.reduce((sum, item) => sum + item.contribution, 0)
      )
      .map(([alliance]) => alliance);

    // Create grid data (max 10 players per alliance for display)
    const grid: (HeatmapData | null)[][] = [];
    sortedAlliances.forEach(alliance => {
      const players = allianceMap.get(alliance)!;
      const row: (HeatmapData | null)[] = [];
      players.slice(0, 10).forEach(player => row.push(player));
      // Fill remaining slots with null
      while (row.length < 10) {
        row.push(null);
      }
      grid.push(row);
    });

    return {
      gridData: grid,
      maxContribution: maxContrib,
      alliances: sortedAlliances
    };
  }, [data]);

  const getContributionColor = (contribution: number) => {
    if (contribution === 0) return 'bg-gray-800';
    const intensity = contribution / maxContribution;
    if (intensity < 0.25) return 'bg-green-900';
    if (intensity < 0.5) return 'bg-green-700';
    if (intensity < 0.75) return 'bg-yellow-600';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-800 border border-gray-600"></div>
            <span>No Data</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-900"></div>
            <span>Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-700"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-600"></div>
            <span>High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500"></div>
            <span>Very High</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Column headers (player indices) */}
          <div className="flex mb-2">
            <div className="w-32 flex-shrink-0"></div>
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="w-12 h-6 text-xs text-gray-400 text-center">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          {gridData.map((row, rowIndex) => (
            <div key={alliances[rowIndex]} className="flex items-center mb-1">
              {/* Alliance name */}
              <div className="w-32 flex-shrink-0 text-sm text-white font-medium pr-4 text-right">
                {alliances[rowIndex]}
              </div>

              {/* Player cells */}
              {row.map((player, colIndex) => (
                <div
                  key={colIndex}
                  className={`w-12 h-12 border border-gray-700 flex items-center justify-center text-xs font-semibold transition-all hover:scale-110 cursor-pointer ${
                    player
                      ? getContributionColor(player.contribution)
                      : 'bg-gray-800'
                  }`}
                  title={player ? `${player.player_name}: $${player.contribution.toLocaleString()}` : 'No player'}
                >
                  {player && (
                    <span className="text-white drop-shadow-lg">
                      {player.player_name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 rounded p-4">
          <div className="text-sm text-gray-400">Total Alliances</div>
          <div className="text-2xl font-bold text-white">{alliances.length}</div>
        </div>
        <div className="bg-gray-700 rounded p-4">
          <div className="text-sm text-gray-400">Max Contribution</div>
          <div className="text-2xl font-bold text-white">${maxContribution.toLocaleString()}</div>
        </div>
        <div className="bg-gray-700 rounded p-4">
          <div className="text-sm text-gray-400">Active Players</div>
          <div className="text-2xl font-bold text-white">
            {data.filter(p => p.contribution > 0).length}
          </div>
        </div>
      </div>

      {/* Top contributors list */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top Contributors</h3>
        <div className="space-y-2">
          {data
            .sort((a, b) => b.contribution - a.contribution)
            .slice(0, 5)
            .map((player, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-700 rounded p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {player.player_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white font-medium">{player.player_name}</div>
                    <div className="text-gray-400 text-sm">{player.alliance_name}</div>
                  </div>
                </div>
                <div className="text-white font-semibold">
                  ${player.contribution.toLocaleString()}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
