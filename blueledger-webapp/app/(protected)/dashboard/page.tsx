'use client';

import CategoryShareChart from '@/features/dashboard/charts/category-share-chart';
import CumulativeSpendYTD from '@/features/dashboard/charts/cumulative-spend-ytd-chart';
import DayOfWeekChart from '@/features/dashboard/charts/day-of-week-chart';
import GroupSpendingChart from '@/features/dashboard/charts/group-spending-chart';
import HourOfDayChart from '@/features/dashboard/charts/hour-of-day-chart';
import SeasonalSpendingChart from '@/features/dashboard/charts/seasonal-spending-chart';
import ToReceiveVsToPayChart from '@/features/dashboard/charts/to-receive-vs-to-pay-chart';
import TopCounterpartiesChart from '@/features/dashboard/charts/top-counterparties-chart';

function DashboardPage() {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <CumulativeSpendYTD />
      <DayOfWeekChart />
      <HourOfDayChart />
      <CategoryShareChart />
      <ToReceiveVsToPayChart />
      <TopCounterpartiesChart />
      <GroupSpendingChart />
      <SeasonalSpendingChart />
    </div>
  );
}

export default DashboardPage;
