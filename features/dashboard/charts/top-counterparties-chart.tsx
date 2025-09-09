'use client';

import type { ChartConfig } from '@/components/ui/chart';
import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import ChartCardContainer from './chart-card-container';

function TopCounterpartiesChart() {
  const counterparties = useMemo(() => ([
    { name: 'Alice', net: 120 },
    { name: 'Bob', net: -80 },
    { name: 'Charlie', net: 60 },
    { name: 'Dana', net: -40 },
  ]), []);

  const chartConfig = {
    net: {
      label: 'Net',
      color: 'var(--chart-1)',
    },
    positive: {
      label: 'Positive',
      color: 'var(--chart-2)',
    },
    negative: {
      label: 'To Pay',
      color: 'var(--chart-5)',
    },
  } satisfies ChartConfig;

  return (
    <ChartCardContainer title="Top Counterparties">
      <ChartContainer config={chartConfig} className="h-72 w-full">
        <BarChart
          accessibilityLayer
          data={counterparties}
          margin={{ left: -10, right: 10, top: 8, bottom: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="name" tickLine={false} tickMargin={10} />
          <YAxis tickLine={false} />
          <ChartTooltip content={<CustomTooltipContent />} />
          <Bar dataKey="net" radius={4}>
            {counterparties.map(c => (
              <Cell key={c.name} fill={c.net >= 0 ? 'var(--chart-2)' : 'var(--chart-5)'} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCardContainer>
  );
}

export default TopCounterpartiesChart;

function CustomTooltipContent({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const entry = payload[0];
    return (
      <div className="bg-background border border-border rounded-lg shadow-md p-3">
        <p className="font-medium text-sm mb-2">{label}</p>
        <div className="flex items-center justify-between gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.dataKey}</span>
          </div>
          <span className="font-medium">
            $
            {entry.value?.toLocaleString()}
          </span>
        </div>
      </div>
    );
  }
  return null;
}
