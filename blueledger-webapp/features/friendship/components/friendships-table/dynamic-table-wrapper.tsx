'use client';

import dynamic from 'next/dynamic';

const DynamicTableWrapper = dynamic(() => import('./friendships-table'), {
  ssr: false,
});

export default DynamicTableWrapper;
