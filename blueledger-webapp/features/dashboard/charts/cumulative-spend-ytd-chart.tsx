'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import Spinner from '@/components/shared/spinner';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { useCumulativeSpendYTDData } from '../hooks';
import ChartCardContainer from './chart-card-container';

function CumulativeSpendYTDChart() {
  const { data: monthly = [], isLoading } = useCumulativeSpendYTDData();

  const chartConfig = {
    cumulative: {
      label: 'Total',
      color: 'var(--chart-1)',
    },
  } as const;

  if (isLoading) {
    return (
      <ChartCardContainer title="Cumulative Spend (YTD)">
        <div className="h-72 w-full flex items-center justify-center">
          <Spinner className="size-8" />
        </div>
      </ChartCardContainer>
    );
  }

  if (monthly.length === 0) {
    return (
      <ChartCardContainer title="Cumulative Spend (YTD)">
        <div className="h-72 w-full flex items-center justify-center">
          <div className="text-muted-foreground">No data available</div>
        </div>
      </ChartCardContainer>
    );
  }

  const cumulativeData = monthly.map(m => ({
    month: m.month,
    cumulative: m.cumulative,
  }));

  return (
    <ChartCardContainer title="Cumulative Spend (YTD)">
      <ChartContainer config={chartConfig} className="h-72 w-full">
        <AreaChart
          accessibilityLayer
          data={cumulativeData}
          margin={{ left: -10, right: 10, top: 8, bottom: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickMargin={10} />
          <YAxis tickLine={false} />
          <ChartTooltip content={<CustomTooltipContent />} />
          <Area dataKey="cumulative" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.2} />
        </AreaChart>
      </ChartContainer>
    </ChartCardContainer>
  );
}

export default CumulativeSpendYTDChart;

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
            <span className="text-muted-foreground">Total</span>
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
