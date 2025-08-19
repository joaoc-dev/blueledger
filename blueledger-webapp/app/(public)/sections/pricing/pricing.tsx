'use client';

import { motion } from 'motion/react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Section } from '../section';
import PLANS from './data.json';
import PricingCard from './pricing-card';

export function Pricing() {
  const isMobile = useIsMobile();

  return (
    <Section
      id="pricing"
      title="Pricing"
      description="Choose the plan that's right for you."
    >

      <div className="landing__container px-8 py-16 flex justify-center">
        <div className="grid gap-8 lg:grid-cols-3 items-center justify-items-center w-full max-w-screen-xl">
          {PLANS.data.map((plan, idx) => {
            const isFeatured = plan.name === 'Pro';
            const delay = isMobile ? 0.15 : idx * 0.3;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay }}
                className="w-full max-w-sm"
              >
                <PricingCard plan={plan} isFeatured={isFeatured} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
