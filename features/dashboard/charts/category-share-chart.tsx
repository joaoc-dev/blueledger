'use client';

import type { ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import Spinner from '@/components/shared/spinner';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { EXPENSE_CATEGORIES_VALUES, generateCategoryChartConfig } from '@/features/expenses/constants';
import { useCategoryShareData } from '../hooks';
import ChartCardContainer from './chart-card-container';

function CategoryShareChart() {
  const { data: chartData = [], isLoading } = useCategoryShareData();

  const chartConfig = generateCategoryChartConfig() satisfies ChartConfig;

  if (isLoading) {
    return (
      <ChartCardContainer title="Category Share per Month">
        <div className="h-72 w-full flex items-center justify-center">
          <Spinner className="size-8" />
        </div>
      </ChartCardContainer>
    );
  }

  if (chartData.length === 0) {
    return (
      <ChartCardContainer title="Category Share per Month">
        <div className="h-72 w-full flex items-center justify-center">
          <div className="text-muted-foreground">No data available</div>
        </div>
      </ChartCardContainer>
    );
  }

  return (
    <ChartCardContainer title="Category Share per Month">
      <ChartContainer config={chartConfig} className="h-72 w-full">
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{ left: -10, right: 10, top: 8, bottom: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickMargin={10} />
          <YAxis tickLine={false} />
          <ChartTooltip content={<CustomTooltipContent />} />
          {EXPENSE_CATEGORIES_VALUES.map(category => (
            <Bar
              key={category}
              dataKey={category}
              stackId="1"
              fill={chartConfig[category]?.color}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </ChartCardContainer>
  );
}

export default CategoryShareChart;

function CustomTooltipContent({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-md p-3">
        <p className="font-medium text-sm mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-6 text-sm mb-1 last:mb-0">
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
        ))}
      </div>
    );
  }
  return null;
}
