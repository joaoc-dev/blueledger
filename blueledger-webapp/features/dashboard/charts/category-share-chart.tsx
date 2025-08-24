'use client';

import type { ChartConfig } from '@/components/ui/chart';
import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import ChartCardContainer from './chart-card-container';

function CategoryShareChart() {
  const months = useMemo(() => ([
    { date: '2024-01' },
    { date: '2024-02' },
    { date: '2024-03' },
    { date: '2024-04' },
    { date: '2024-05' },
    { date: '2024-06' },
    { date: '2024-07' },
    { date: '2024-08' },
  ]), []);

  const chartData = months.map((m, i) => (
    {
      date: m.date,
      groceries: 400 + 20 * i,
      dining: 300 + 10 * i,
      transport: 150 + 5 * i,
    }));

  const chartConfig = {
    groceries: {
      label: 'Groceries',
      color: 'var(--chart-1)',
    },
    dining: {
      label: 'Dining',
      color: 'var(--chart-2)',
    },
    transport: {
      label: 'Transport',
      color: 'var(--chart-3)',
    },
  } satisfies ChartConfig;

  return (
    <ChartCardContainer title="Category Share per Month">
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{ left: -10, right: 10, top: 8, bottom: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickMargin={10} />
          <YAxis tickLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="groceries" stackId="1" fill="var(--chart-1)" />
          <Bar dataKey="dining" stackId="1" fill="var(--chart-2)" />
          <Bar dataKey="transport" stackId="1" fill="var(--chart-3)" />
        </BarChart>
      </ChartContainer>
    </ChartCardContainer>
  );
}

export default CategoryShareChart;
