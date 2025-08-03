import Skeleton from '@/components/shared/skeleton';
import { HandCoins } from 'lucide-react';
import Link from 'next/link';

const NavBarLoading = () => {
  return (
    <>
      {/* mobile nav bar */}
      <div className="nav nav--mobile border-b md:hidden">
        <div className="w-10 mx-2">
          <Skeleton className="h-6 bg-muted rounded-md inline" />
        </div>

        <Link
          href="/"
          className="icon-button absolute left-1/2 -translate-x-1/2"
        >
          <HandCoins />
        </Link>

        <div className="w-20 mx-2">
          <Skeleton className="w-5 h-6 bg-muted rounded-md inline" />
        </div>
      </div>
      {/* desktop nav bar */}
      <div className="nav hidden md:flex">
        <div>
          <Link href="/" className="nav__brand nav__item hover:text-foreground">
            <HandCoins />
            <span className="text-2xl">Blue Ledger</span>
          </Link>
        </div>
        <div className="w-20 mx-2">
          <Skeleton className="w-5 h-6 bg-muted rounded-md inline" />
        </div>
      </div>
    </>
  );
};

export default NavBarLoading;
