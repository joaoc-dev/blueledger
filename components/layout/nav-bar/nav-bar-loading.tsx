import { HandCoins } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

function NavBarLoading() {
  return (
    <>
      {/* mobile nav bar */}
      <div className="sticky top-0 z-50 border-b supports-[backdrop-filter]:bg-background/70 bg-background/90 mb-16 md:hidden">
        <div className="max-w-screen-xl mx-auto">
          <div className="nav">
            <Skeleton className="ml-2 h-6 w-6" />

            <Link
              href="/"
              className="icon-button absolute left-1/2 -translate-x-1/2"
            >
              <HandCoins />
            </Link>

            <Skeleton className="mr-2 h-6 w-20" />
          </div>
        </div>
      </div>

      {/* desktop nav bar */}
      <div className="nav hidden md:flex">
        <div>
          <Link href="/" className="nav__brand nav__item text-foreground">
            <HandCoins />
            <span className="text-xl">BlueLedger</span>
          </Link>
        </div>
        <Skeleton className="h-6 w-30" />
      </div>
    </>
  );
}

export default NavBarLoading;
