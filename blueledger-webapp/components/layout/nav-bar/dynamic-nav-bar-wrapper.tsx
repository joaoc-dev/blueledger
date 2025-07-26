'use client';

import dynamic from 'next/dynamic';

const DynamicNavBarWrapper = dynamic(() => import('./nav-bar'), {
  ssr: false,
});

export default DynamicNavBarWrapper;
