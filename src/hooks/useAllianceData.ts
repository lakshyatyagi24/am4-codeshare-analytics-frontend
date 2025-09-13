import { useState, useEffect } from 'react';
import type { AllianceOverview, AllianceData } from '../types';

export const useAllianceData = (apiData: AllianceData[]) => {
  const [data, setData] = useState<AllianceOverview[]>([]);
  const [trendData, setTrendData] = useState<Array<{ date: string; [key: string]: number | string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      const today = '2025-09-02';
      const todayData = apiData.filter(item => item.entry_date === today);

      // Group today's data by alliance
      const todayGroups = todayData.reduce((acc, item) => {
        if (!acc[item.alliance_name]) {
          acc[item.alliance_name] = [];
        }
        acc[item.alliance_name].push(item);
        return acc;
      }, {} as Record<string, AllianceData[]>);

      // Compute overview for each alliance
      const overview: AllianceOverview[] = Object.entries(todayGroups).map(([alliance, items]) => {
        const total_flights = items.reduce((sum, item) => sum + item.flights, 0);
        const total_contributed = items.reduce((sum, item) => sum + item.contributed, 0);
        const active_partners = items.filter(item => item.online).length;
        const avg_share = items.reduce((sum, item) => sum + item.share, 0) / items.length;
        const avg_ytd = items.reduce((sum, item) => sum + item.ytd_average, 0) / items.length;

        // Calculate MTD and YTD contributions
        const currentMonth = new Date(today).getMonth();
        const currentYear = new Date(today).getFullYear();
        const mtdData = apiData.filter(item =>
          item.alliance_name === alliance &&
          new Date(item.entry_date).getMonth() === currentMonth &&
          new Date(item.entry_date).getFullYear() === currentYear
        );
        const ytdData = apiData.filter(item =>
          item.alliance_name === alliance &&
          new Date(item.entry_date).getFullYear() === currentYear
        );

        const mtd_contributed = mtdData.reduce((sum, item) => sum + item.contributed, 0);
        const ytd_contributed = ytdData.reduce((sum, item) => sum + item.contributed, 0);

        // Calculate new joins (players who joined this month)
        const newJoins = items.filter(item =>
          new Date(item.joined).getMonth() === currentMonth &&
          new Date(item.joined).getFullYear() === currentYear
        ).length;

        // Activity rate
        const activity_rate = (active_partners / items.length) * 100;

        // For growth, calculate from historical data
        const prevMonthData = apiData.filter(item =>
          item.alliance_name === alliance &&
          new Date(item.entry_date).getMonth() === currentMonth - 1 &&
          new Date(item.entry_date).getFullYear() === currentYear
        );
        const prevMonthContributed = prevMonthData.reduce((sum, item) => sum + item.contributed, 0);
        const month_growth_contributed = prevMonthContributed > 0 ?
          ((total_contributed - prevMonthContributed) / prevMonthContributed) * 100 : 0;

        // Engagement score based on avg ytd and active partners
        const engagement_score = (avg_ytd / 300) * 100 + activity_rate * 0.2;

        return {
          alliance_name: alliance,
          total_flights,
          total_contributed,
          active_partners,
          avg_share,
          avg_ytd,
          month_growth_flights: 0, // Will calculate from trends
          month_growth_contributed,
          engagement_score,
          total_players: items.length,
          new_joins: newJoins,
          activity_rate,
          mtd_contributed,
          ytd_contributed,
          total_share: items.reduce((sum, item) => sum + item.share, 0)
        };
      });

      setData(overview);

      // Prepare trend data for charts
      const dates = ['2025-07-03', '2025-08-03', '2025-09-02'];
      const trendChartData = dates.map(date => {
        const dayData = apiData.filter(item => item.entry_date === date);
        const dayGroups = dayData.reduce((acc, item) => {
          if (!acc[item.alliance_name]) {
            acc[item.alliance_name] = [];
          }
          acc[item.alliance_name].push(item);
          return acc;
        }, {} as Record<string, AllianceData[]>);

        const result: { date: string; [key: string]: number | string } = { date };
        Object.keys(dayGroups).forEach(alliance => {
          result[`${alliance}_contributed`] = dayGroups[alliance].reduce((sum, item) => sum + item.contributed, 0);
          result[`${alliance}_flights`] = dayGroups[alliance].reduce((sum, item) => sum + item.flights, 0);
        });
        return result;
      });

      setTrendData(trendChartData);
      setLoading(false);
    };

    fetchData();
  }, [apiData]);

  return { data, trendData, loading };
};
