'use client';

import { useState, useMemo } from 'react';
import { ContributorData } from '../types';

interface ContributorTableProps {
  data: ContributorData[];
  title: string;
}

type SortField = 'share' | 'contributed' | 'flights' | 'joined' | 'last_active';
type SortDirection = 'asc' | 'desc';
type FilterType = 'all' | 'top' | 'recent' | 'inactive';

export default function ContributorTable({ data, title }: ContributorTableProps) {
  const [sortField, setSortField] = useState<SortField>('share');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(player =>
        player.player_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.alliance_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    switch (filterType) {
      case 'top':
        filtered = filtered.filter(player => player.share >= 15);
        break;
      case 'recent':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filtered = filtered.filter(player => new Date(player.joined) >= thirtyDaysAgo);
        break;
      case 'inactive':
        filtered = filtered.filter(player => player.status === 'inactive');
        break;
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      if (sortField === 'joined' || sortField === 'last_active') {
        aValue = new Date(a[sortField]).getTime();
        bValue = new Date(b[sortField]).getTime();
      } else {
        aValue = a[sortField];
        bValue = b[sortField];
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection, filterType, searchTerm]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Players</option>
            <option value="top">Top Contributors</option>
            <option value="recent">Recent Joiners</option>
            <option value="inactive">Inactive Players</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-gray-300 font-semibold">Player</th>
              <th className="text-left py-3 px-4 text-gray-300 font-semibold">Alliance</th>
              <th
                className="text-right py-3 px-4 text-gray-300 font-semibold cursor-pointer hover:text-white"
                onClick={() => handleSort('share')}
              >
                Share % {getSortIcon('share')}
              </th>
              <th
                className="text-right py-3 px-4 text-gray-300 font-semibold cursor-pointer hover:text-white"
                onClick={() => handleSort('contributed')}
              >
                Contributed {getSortIcon('contributed')}
              </th>
              <th
                className="text-right py-3 px-4 text-gray-300 font-semibold cursor-pointer hover:text-white"
                onClick={() => handleSort('flights')}
              >
                Flights {getSortIcon('flights')}
              </th>
              <th
                className="text-left py-3 px-4 text-gray-300 font-semibold cursor-pointer hover:text-white"
                onClick={() => handleSort('joined')}
              >
                Joined {getSortIcon('joined')}
              </th>
              <th
                className="text-left py-3 px-4 text-gray-300 font-semibold cursor-pointer hover:text-white"
                onClick={() => handleSort('last_active')}
              >
                Last Active {getSortIcon('last_active')}
              </th>
              <th className="text-center py-3 px-4 text-gray-300 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((player, index) => (
              <tr
                key={index}
                className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {player.player_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white font-medium">{player.player_name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-300">{player.alliance_name}</td>
                <td className="py-3 px-4 text-white text-right font-semibold">
                  {player.share.toFixed(1)}%
                </td>
                <td className="py-3 px-4 text-white text-right">
                  ${player.contributed.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-white text-right">
                  {player.flights.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-gray-300">
                  {new Date(player.joined).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-gray-300">
                  {new Date(player.last_active).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    player.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : player.status === 'new'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full mr-1 ${
                      player.status === 'active' ? 'bg-green-400' :
                      player.status === 'new' ? 'bg-blue-400' : 'bg-red-400'
                    }`}></span>
                    {player.status.charAt(0).toUpperCase() + player.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedData.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No players found matching the current filters.
        </div>
      )}

      <div className="mt-4 text-sm text-gray-400">
        Showing {filteredAndSortedData.length} of {data.length} players
      </div>
    </div>
  );
}
