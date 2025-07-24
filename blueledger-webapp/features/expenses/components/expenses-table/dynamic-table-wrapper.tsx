'use client';

import dynamic from 'next/dynamic';

const DynamicTableWrapper = dynamic(() => import('./table'), {
  ssr: false,
});

export default DynamicTableWrapper;
