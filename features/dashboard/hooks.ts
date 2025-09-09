import type {
  CategoryShareData,
  CumulativeSpendData,
  DayOfWeekData,
  HourOfDayData,
  SeasonalData,
} from './schemas';
import { useQuery } from '@tanstack/react-query';
import { dashboardKeys } from '@/constants/query-keys';
import { getDashboardData } from './client';

function useDashboardData() {
  return useQuery({
    queryKey: dashboardKeys.charts,
    queryFn: getDashboardData,
  });
}

export function useCumulativeSpendYTDData(): { data: CumulativeSpendData[]; isLoading: boolean } {
  const { data, isLoading } = useDashboardData();
  return { data: data?.cumulativeSpend ?? [], isLoading };
}

export function useDayOfWeekData(): { data: DayOfWeekData[]; isLoading: boolean } {
  const { data, isLoading } = useDashboardData();
  return { data: data?.dayOfWeek ?? [], isLoading };
}

export function useHourOfDayData(): { data: HourOfDayData[]; isLoading: boolean } {
  const { data, isLoading } = useDashboardData();
  return { data: data?.hourOfDay ?? [], isLoading };
}

export function useCategoryShareData(): { data: CategoryShareData[]; isLoading: boolean } {
  const { data, isLoading } = useDashboardData();
  return { data: data?.categoryShare ?? [], isLoading };
}

export function useSeasonalData(): { data: SeasonalData[]; isLoading: boolean } {
  const { data, isLoading } = useDashboardData();
  return { data: data?.seasonal ?? [], isLoading };
}
