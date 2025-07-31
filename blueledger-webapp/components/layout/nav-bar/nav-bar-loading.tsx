import React from 'react';
import Skeleton from '@/components/shared/skeleton';

const NavBarLoading = () => {
  return (
    <div className="nav">
      <div className="w-20 mx-2">
        <Skeleton className="w-5 h-6 bg-muted rounded-md inline" />
      </div>
      <div className="w-20 mx-2">
        <Skeleton className="w-5 h-6 bg-muted rounded-md inline" />
      </div>
    </div>
  );
};

export default NavBarLoading;
