'use client';

import { Section } from '../section';
import { TestimonialCarousel } from './testimonial-carousel';

export function Testimonials() {
  return (
    <Section
      title="Trusted Worldwide"
      description="What are people saying about us?"
    >
      <div className="landing__container py-16 flex flex-col items-center justify-center min-w-0">
        <TestimonialCarousel />
      </div>
    </Section>
  );
}
