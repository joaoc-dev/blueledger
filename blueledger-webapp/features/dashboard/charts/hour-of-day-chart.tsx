'use client';

import type { ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import ChartCardContainer from './chart-card-container';

function HourOfDayChart() {
  const chartData = Array.from({ length: 24 }, (_, h) => ({ h, total: Math.round(100 + 80 * Math.sin((h / 24) * Math.PI * 2)) }));
  const chartConfig = {
    total: {
      label: 'Total',
      color: 'var(--chart-4)',
    },
  } satisfies ChartConfig;
  return (
    <ChartCardContainer title="Hour-of-Day">
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{ left: -10, right: 10, top: 8, bottom: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="h" tickLine={false} tickMargin={10} />
          <YAxis tickLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="total" fill="var(--chart-4)" radius={2} />
        </BarChart>
      </ChartContainer>
    </ChartCardContainer>
  );
}

export default HourOfDayChart;
