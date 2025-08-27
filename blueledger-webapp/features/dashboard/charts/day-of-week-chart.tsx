'use client';

import type { ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import ChartCardContainer from './chart-card-container';

function DayOfWeekChart() {
  const chartData = [
    { dow: 'Mon', total: 300 },
    { dow: 'Tue', total: 280 },
    { dow: 'Wed', total: 320 },
    { dow: 'Thu', total: 290 },
    { dow: 'Fri', total: 450 },
    { dow: 'Sat', total: 500 },
    { dow: 'Sun', total: 380 },
  ];

  const chartConfig = {
    total: {
      label: 'Total',
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;

  return (
    <ChartCardContainer title="Day-of-Week Average">
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <BarChart
          accessibilityLayer
          margin={{ left: -10, right: 10, top: 8, bottom: 8 }}
          data={chartData}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="dow" tickLine={false} tickMargin={10} />
          <YAxis tickLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="total" fill="var(--chart-1)" radius={4} />
        </BarChart>
      </ChartContainer>
    </ChartCardContainer>
  );
}

export default DayOfWeekChart;
