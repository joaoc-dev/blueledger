import type { DashboardData } from './schemas';
import { apiGet } from '@/lib/api-client';

const endpoint = '/dashboard';

export async function getDashboardData(): Promise<DashboardData> {
  return await apiGet<DashboardData>(endpoint);
}
