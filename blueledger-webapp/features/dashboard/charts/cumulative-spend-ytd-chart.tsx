'use client';

import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import ChartCardContainer from './chart-card-container';

function CumulativeSpendYTDChart() {
  const monthly = useMemo(() => ([
    { date: '2024-01', spend: 1800, shared: 700, solo: 1100, count: 42, avg: 43 },
    { date: '2024-02', spend: 1500, shared: 500, solo: 1000, count: 37, avg: 41 },
    { date: '2024-03', spend: 2100, shared: 900, solo: 1200, count: 50, avg: 42 },
    { date: '2024-04', spend: 1900, shared: 800, solo: 1100, count: 46, avg: 41 },
    { date: '2024-05', spend: 2350, shared: 1050, solo: 1300, count: 54, avg: 43 },
    { date: '2024-06', spend: 2200, shared: 900, solo: 1300, count: 51, avg: 43 },
    { date: '2024-07', spend: 2600, shared: 1200, solo: 1400, count: 60, avg: 43 },
    { date: '2024-08', spend: 2400, shared: 1000, solo: 1400, count: 55, avg: 44 },
  ]), []);

  const chartConfig = {
    cumulative: {
      label: 'Total',
      color: 'var(--chart-1)',
    },
  } as const;

  return (
    <ChartCardContainer title="Cumulative Spend (YTD)">
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <AreaChart
          accessibilityLayer
          data={monthly.map((m, i, arr) => ({ date: m.date, cumulative: arr.slice(0, i + 1).reduce((s, x) => s + x.spend, 0) }))}
          margin={{ left: -10, right: 10, top: 8, bottom: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickMargin={10} />
          <YAxis tickLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area dataKey="cumulative" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.2} />
        </AreaChart>
      </ChartContainer>
    </ChartCardContainer>
  );
}

export default CumulativeSpendYTDChart;
