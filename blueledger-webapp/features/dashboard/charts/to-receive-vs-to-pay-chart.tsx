import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import ChartCardContainer from './chart-card-container';

function ToReceiveVsToPayChart() {
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
      receive: 200 + i * 20,
      pay: 150 + i * 15,
    }));

  const domColors = {
    receive: {
      label: 'Receive',
      color: 'var(--chart-2)',
    },
    pay: {
      label: 'Pay',
      color: 'var(--chart-5)',
    },
  } as const;

  return (
    <ChartCardContainer title="To Receive vs To Pay">
      <ChartContainer config={domColors} className="h-64 w-full">
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{ left: -10, right: 10, top: 8, bottom: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickMargin={10} />
          <YAxis tickLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area dataKey="receive" stackId="1" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.25} />
          <Area dataKey="pay" stackId="1" stroke="var(--chart-5)" fill="var(--chart-5)" fillOpacity={0.25} />
        </AreaChart>
      </ChartContainer>
    </ChartCardContainer>
  );
}

export default ToReceiveVsToPayChart;
