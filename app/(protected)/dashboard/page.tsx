import type { Metadata } from 'next';
import CategoryShareChart from '@/features/dashboard/charts/category-share-chart';
import CumulativeSpendYTD from '@/features/dashboard/charts/cumulative-spend-ytd-chart';
import DayOfWeekChart from '@/features/dashboard/charts/day-of-week-chart';
import HourOfDayChart from '@/features/dashboard/charts/hour-of-day-chart';
import SeasonalSpendingChart from '@/features/dashboard/charts/seasonal-spending-chart';
import { pageSeoConfigs } from '@/lib/seo';

export const metadata: Metadata = {
  title: pageSeoConfigs.dashboard.title,
  description: pageSeoConfigs.dashboard.description,
  robots: {
    index: false, // Dashboard should not be indexed
    follow: false,
  },
};

function DashboardPage() {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <CumulativeSpendYTD />
      <DayOfWeekChart />
      <HourOfDayChart />
      <CategoryShareChart />
      <SeasonalSpendingChart />
    </div>
  );
}

export default DashboardPage;
