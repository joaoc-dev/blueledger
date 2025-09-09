'use client';

import type { ChartConfig } from '@/components/ui/chart';
import React, { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import ChartCardContainer from './chart-card-container';

function GroupSpendingChart() {
  const monthly = useMemo(() => ([
    { date: '2024-01' },
    { date: '2024-02' },
    { date: '2024-03' },
    { date: '2024-04' },
    { date: '2024-05' },
    { date: '2024-06' },
    { date: '2024-07' },
    { date: '2024-08' },
  ]), []);

  const groups = useMemo(() => ([
    { name: 'Roommates', total: 1100 },
    { name: 'Trip', total: 850 },
    { name: 'Gym Buddies', total: 300 },
  ]), []);

  const chartConfig = {
    total: {
      label: 'Total Spend',
      color: 'var(--chart-3)',
    },
  } satisfies ChartConfig;

  // Focused controls and derived data
  const months = useMemo(() => ['All', ...monthly.map(m => m.date)], [monthly]);
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const selectedMonthIndex = useMemo(() => monthly.findIndex(m => m.date === selectedMonth), [monthly, selectedMonth]);
  const spendByTypeRows = useMemo(() => {
    const isAll = selectedMonth === 'All';
    const baseGroups = groups.map((g, idx) => ({
      label: g.name,
      total: isAll ? g.total : Math.max(100, Math.round(g.total * (0.7 + 0.1 * ((selectedMonthIndex + idx) % 3)))),
    }));
    const friendsTotal = isAll ? 1600 : 800 + (selectedMonthIndex + 1) * 60;
    const soloTotal = isAll ? 3000 : 1000 + (selectedMonthIndex + 1) * 90;
    return [...baseGroups, { label: 'Friends', total: friendsTotal }, { label: 'Solo', total: soloTotal }];
  }, [groups, selectedMonth, selectedMonthIndex]);

  return (
    <ChartCardContainer
      title="Group Spending"
      headerOptions={(
        <>
          <label className="mr-2 text-sm text-muted-foreground">Month</label>
          <select
            className="border rounded px-2 py-1 text-sm bg-background"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          >
            {months.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </>
      )}
    >
      <ChartContainer config={chartConfig} className="h-72 w-full">
        <BarChart
          accessibilityLayer
          data={spendByTypeRows}
          margin={{ left: -10, right: 10, top: 8, bottom: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
          <YAxis tickLine={false} />
          <ChartTooltip content={<CustomTooltipContent />} />
          <Bar dataKey="total" fill="var(--chart-3)" radius={4} />
        </BarChart>
      </ChartContainer>
    </ChartCardContainer>
  );
}

export default GroupSpendingChart;

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
