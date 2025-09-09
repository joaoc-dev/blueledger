'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <div className="relative z-10 px-8 pt-16 md:pt-16 grid text-center items-center min-h-[calc(100svh-4rem)]">
      <div className="space-y-16">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight"
        >
          Next-Generation Expense Sharing, Powered by AI
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
          className="text-lg text-muted-foreground"
        >
          Effortlessly track spending, split bills, scan receipts, and get smart insights — all in one sleek app.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="flex gap-3 justify-center"
        >
          <Button asChild className="px-5 py-5.5 text-md font-medium">
            <Link href="/auth/signup">Get Started</Link>
          </Button>
          <Button asChild variant="ghost" className="px-5 py-5.5 text-md border bg-foreground/3">
            <Link href="/auth/signin">Sign in</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
