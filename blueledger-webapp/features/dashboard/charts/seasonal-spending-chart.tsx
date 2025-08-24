'use client';

import type { ChartConfig } from '@/components/ui/chart';
import { useMemo } from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import ChartCardContainer from './chart-card-container';

function SeasonalSpendingChart() {
  const monthlyData = useMemo(() => ([
    { month: 'Jan', spend: 1850 },
    { month: 'Feb', spend: 1620 },
    { month: 'Mar', spend: 1980 },
    { month: 'Apr', spend: 1750 },
    { month: 'May', spend: 2120 },
    { month: 'Jun', spend: 2280 },
    { month: 'Jul', spend: 2450 },
    { month: 'Aug', spend: 2320 },
    { month: 'Sep', spend: 1950 },
    { month: 'Oct', spend: 2080 },
    { month: 'Nov', spend: 2350 },
    { month: 'Dec', spend: 2850 },
  ]), []);

  const seasonalData = useMemo(() => {
    const seasons = {
      Winter: { months: ['Dec', 'Jan', 'Feb'], color: 'var(--chart-1)', label: 'Winter' },
      Spring: { months: ['Mar', 'Apr', 'May'], color: 'var(--chart-2)', label: 'Spring' },
      Summer: { months: ['Jun', 'Jul', 'Aug'], color: 'var(--chart-5)', label: 'Summer' },
      Autumn: { months: ['Sep', 'Oct', 'Nov'], color: 'var(--chart-4)', label: 'Autumn' },
    };

    return Object.entries(seasons).map(([_season, config]) => {
      const seasonMonths = monthlyData.filter(item => config.months.includes(item.month));
      const totalSpend = seasonMonths.reduce((sum, month) => sum + month.spend, 0);

      return {
        season: config.label,
        spend: totalSpend,
        avgSpend: Math.round(totalSpend / seasonMonths.length),
        color: config.color,
      };
    });
  }, [monthlyData]);

  const chartConfig = {
    spend: {
      label: 'Total Spend',
    },
    winter: {
      label: 'Winter',
      color: 'var(--chart-1)',
    },
    spring: {
      label: 'Spring',
      color: 'var(--chart-2)',
    },
    summer: {
      label: 'Summer',
      color: 'var(--chart-5)',
    },
    autumn: {
      label: 'Autumn',
      color: 'var(--chart-4)',
    },
  } satisfies ChartConfig;

  return (
    <ChartCardContainer title="Seasonal Spending">
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <PieChart>
          <ChartTooltip
            content={(
              <ChartTooltipContent
                formatter={value => [
                  `$${value.toLocaleString()}`,
                ]}
              />
            )}
          />
          <Pie
            data={seasonalData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ season, percent }) =>
              `${season}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={90}
            dataKey="spend"
            nameKey="season"
          >
            {seasonalData.map(entry => (
              <Cell key={`cell-${entry.season}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
    </ChartCardContainer>
  );
}

export default SeasonalSpendingChart;
