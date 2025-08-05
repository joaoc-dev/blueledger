'use client';

import dynamic from 'next/dynamic';

const DynamicTableWrapper = dynamic(() => import('./expenses-table'), {
  ssr: false,
});

export default DynamicTableWrapper;
