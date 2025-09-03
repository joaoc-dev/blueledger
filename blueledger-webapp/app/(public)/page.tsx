import type { Metadata } from 'next';
import { pageSeoConfigs } from '@/lib/seo';
import { LandingNav } from './landing-nav';
import { Faq } from './sections/faq/faq';
import { Features } from './sections/features/features';
import { Footer } from './sections/footer';
import { Hero } from './sections/hero';
import { Pricing } from './sections/pricing/pricing';
import { Testimonials } from './sections/testimonials/testimonials';

export const metadata: Metadata = {
  title: pageSeoConfigs.home.title,
  description: pageSeoConfigs.home.description,
  keywords: [
    'expense tracking app',
    'bill splitting app',
    'group expenses',
    'financial management',
    'budget app',
    'receipt scanner',
    'money management app',
    'shared expenses',
    'expense sharing',
    'split bills',
  ],
  openGraph: {
    title: pageSeoConfigs.home.title,
    description: pageSeoConfigs.home.description,
    type: 'website',
    images: [
      {
        url: '/app_screenshot.png',
        width: 1200,
        height: 630,
        alt: 'Blue Ledger - Smart Expense Management',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageSeoConfigs.home.title,
    description: pageSeoConfigs.home.description,
    images: ['/app_screenshot.png'],
  },
};

export default function Home() {
  return (
    <div className="dark bg-background text-foreground min-h-screen">
      <LandingNav />
      <header>
        <section
          id="hero"
          className="landing__section landing__hero landing__grid max-w-screen-3xl mx-auto"
        >
          <Hero />
        </section>
      </header>
      <main className="mt-16">
        <Features />
        <Pricing />
        <Testimonials />
        <Faq />
      </main>
      <div className="landing__splitter" />
      <footer id="footer" className="landing__container">
        <Footer />
      </footer>
    </div>
  );
}
