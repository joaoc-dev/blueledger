'use client';

import dynamic from 'next/dynamic';
import GroupsTableSkeleton from './groups-table-skeleton';

const DynamicTableWrapper = dynamic(() => import('./groups-table'), {
  ssr: false,
  loading: () => <GroupsTableSkeleton />,
});

export default DynamicTableWrapper;
