import { HandCoins } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

function NavBarLoading() {
  return (
    <>
      {/* mobile nav bar */}
      <div className="nav nav--mobile border-b md:hidden">
        <Skeleton className="ml-2 h-6 w-6" />

        <Link
          href="/"
          className="icon-button absolute left-1/2 -translate-x-1/2"
        >
          <HandCoins />
        </Link>

        <Skeleton className="mr-2 h-6 w-20" />
      </div>
      {/* desktop nav bar */}
      <div className="nav hidden md:flex">
        <div>
          <Link href="/" className="nav__brand nav__item hover:text-foreground">
            <HandCoins />
            <span className="text-2xl">Blue Ledger</span>
          </Link>
        </div>
        <Skeleton className="h-6 w-30" />
      </div>
    </>
  );
}

export default NavBarLoading;
