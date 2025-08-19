'use client';

import { HandCoins } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function LandingNav() {
  return (
    <div className="landing__nav">
      <nav className="max-w-screen-2xl mx-auto h-16 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <HandCoins className="w-5 h-5" />
          <span className="font-semibold">BlueLedger</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#features" className="landing__text-link">Features</a>
          <a href="#pricing" className="landing__text-link">Pricing</a>
          <a href="#testimonials" className="landing__text-link">Testimonials</a>
          <a href="#faq" className="landing__text-link">FAQ</a>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="border bg-foreground/3">
            <Link href="/auth/signin">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </div>
      </nav>
    </div>
  );
}
