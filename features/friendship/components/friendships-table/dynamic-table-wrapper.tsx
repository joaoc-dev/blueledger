'use client';

import dynamic from 'next/dynamic';
import FriendshipsTableSkeleton from './friendships-table-skeleton';

const DynamicTableWrapper = dynamic(() => import('./friendships-table'), {
  ssr: false,
  loading: () => <FriendshipsTableSkeleton />,
});

export default DynamicTableWrapper;
