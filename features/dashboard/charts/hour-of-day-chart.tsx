'use client';

import type { ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import Spinner from '@/components/shared/spinner';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { useHourOfDayData } from '../hooks';
import ChartCardContainer from './chart-card-container';

function HourOfDayChart() {
  const { data: rawData = [], isLoading } = useHourOfDayData();

  const chartData = rawData.map(item => ({
    h: Number.parseInt(item.hour.split(':')[0] || '0'), // Extract hour number from "HH:00" format
    average: item.averageSpent,
  }));

  const chartConfig = {
    average: {
      label: 'Average',
      color: 'var(--chart-4)',
    },
  } satisfies ChartConfig;
  if (isLoading) {
    return (
      <ChartCardContainer title="Hour-of-Day Average">
        <div className="h-72 w-full flex items-center justify-center">
          <Spinner className="size-8" />
        </div>
      </ChartCardContainer>
    );
  }

  if (chartData.every(item => item.average === 0)) {
    return (
      <ChartCardContainer title="Hour-of-Day Average">
        <div className="h-72 w-full flex items-center justify-center">
          <div className="text-muted-foreground">No data available</div>
        </div>
      </ChartCardContainer>
    );
  }

  return (
    <ChartCardContainer title="Hour-of-Day Average">
      <ChartContainer config={chartConfig} className="h-72 w-full">
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{ left: -10, right: 10, top: 8, bottom: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="h"
            tickLine={false}
            tickMargin={10}
            tickFormatter={(value, index) => {
              if (index % 2 === 0) {
                return `${value.toString().padStart(2, '0')}:00`;
              }
              return '';
            }}
          />
          <YAxis tickLine={false} />
          <ChartTooltip content={<CustomTooltipContent />} />
          <Bar dataKey="average" fill="var(--chart-4)" radius={2} />
        </BarChart>
      </ChartContainer>
    </ChartCardContainer>
  );
}

export default HourOfDayChart;

function CustomTooltipContent({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const entry = payload[0];

    return (
      <div className="bg-background border border-border rounded-lg shadow-md p-3">
        <p className="font-medium text-sm mb-2">
          {label}
          :00
        </p>
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: 'var(--chart-4)' }}
              />
              <span className="text-muted-foreground">Average</span>
            </div>
            <span className="font-medium">
              $
              {(entry.payload?.average || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
