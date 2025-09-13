'use client';

import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface MiniSparklineProps {
  data: number[];
  color?: string;
  height?: number;
  showTooltip?: boolean;
}

export default function MiniSparkline({
  data,
  color = '#00d4ff',
  height = 40,
  showTooltip = false
}: MiniSparklineProps) {
  const chartData = data.map((value, index) => ({
    day: index + 1,
    value
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          activeDot={showTooltip ? { r: 2, fill: color } : false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
