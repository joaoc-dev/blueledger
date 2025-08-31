'use client';

import dynamic from 'next/dynamic';

const DynamicTableWrapper = dynamic(() => import('./groups-table'), {
  ssr: false,
});

export default DynamicTableWrapper;
