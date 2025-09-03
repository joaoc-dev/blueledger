'use client';

import type { TooltipProps } from 'recharts';
import type { SeasonLabel } from '../constants';
import type { SeasonalData } from '../schemas';
import type { ChartConfig } from '@/components/ui/chart';

import { Cell, Pie, PieChart } from 'recharts';
import Spinner from '@/components/shared/spinner';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { useSeasonalData } from '../hooks';
import ChartCardContainer from './chart-card-container';

const COLOR_MAP: Record<SeasonLabel, string> = {
  'Dec–Feb': 'var(--chart-1)',
  'Mar–May': 'var(--chart-2)',
  'Jun–Aug': 'var(--chart-5)',
  'Sep–Nov': 'var(--chart-4)',
};

function SeasonalSpendingChart() {
  const { data: seasonalData = [], isLoading } = useSeasonalData();

  const chartConfig = {
    'Dec–Feb': { label: 'Dec–Feb', color: COLOR_MAP['Dec–Feb'] },
    'Mar–May': { label: 'Mar–May', color: COLOR_MAP['Mar–May'] },
    'Jun–Aug': { label: 'Jun–Aug', color: COLOR_MAP['Jun–Aug'] },
    'Sep–Nov': { label: 'Sep–Nov', color: COLOR_MAP['Sep–Nov'] },
  } satisfies ChartConfig;

  if (isLoading) {
    return (
      <ChartCardContainer title="Seasonal Spending">
        <div className="h-72 w-full flex items-center justify-center">
          <Spinner className="size-8" />
        </div>
      </ChartCardContainer>
    );
  }

  if (seasonalData.every(d => d.spent === 0)) {
    return (
      <ChartCardContainer title="Seasonal Spending">
        <div className="h-72 w-full flex items-center justify-center">
          <div className="text-muted-foreground">No data available</div>
        </div>
      </ChartCardContainer>
    );
  }

  const pieData = seasonalData.map(d => ({
    ...d,
    fill: COLOR_MAP[d.season as SeasonLabel],
  }));

  return (
    <ChartCardContainer title="Seasonal Spending">
      <div className="flex flex-col h-full">
        <ChartContainer config={chartConfig} className="flex-1 w-full min-h-0">
          <PieChart>
            <ChartTooltip content={<CustomTooltip />} />
            <Pie
              data={pieData}
              dataKey="spent"
              nameKey="season"
              labelLine={false}
              innerRadius={55}
              outerRadius={85}
            >
              {pieData.map(entry => (
                <Cell key={`cell-${entry.season}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <CustomLegend payload={pieData.map(d => ({
          value: d.season,
          color: d.fill,
          payload: d,
        }))}
        />
      </div>
    </ChartCardContainer>
  );
}

export default SeasonalSpendingChart;

function CustomTooltip({
  active,
  payload,
}: TooltipProps<number, string>) {
  if (active && payload && payload.length && payload[0]) {
    const data = payload[0].payload as SeasonalData;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-md">
        <div className="flex gap-1 items-center">
          <div
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: COLOR_MAP[data.season as SeasonLabel] }}
          />
          <span className="font-medium text-md">{data.season}</span>
        </div>
        <div className="mt-1 space-y-1 text-sm">
          <div className="flex gap-1 items-center">
            <span className="text-muted-foreground">Total Spent:</span>
            <span className="font-medium">
              $
              {data.spent.toFixed(2)}
            </span>
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-muted-foreground">Expenses:</span>
            <span className="font-medium">{data.count}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

function CustomLegend({ payload }: {
  payload?: Array<{
    value: string;
    color: string;
    payload: SeasonalData;
  }>;
}) {
  if (!payload?.length)
    return null;

  return (
    <div className="grid grid-cols-2 gap-2 mt-0.5 place-items-center">
      {payload.map(entry => (
        <div
          key={`legend-${entry.payload.season}`}
          className="flex items-center gap-1.5 sm:gap-2 w-full justify-center"
        >
          <div
            className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-sm shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <div className="flex gap-1 sm:gap-1.5 text-xs">
            <span className="font-medium">{entry.payload.season}</span>
            <span className="text-muted-foreground">
              {entry.payload.percent}
              %
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
