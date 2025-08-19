'use client';

import type { CarouselApi } from '@/components/ui/carousel';
import { motion } from 'motion/react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useCarouselBlur } from '@/components/shared/carousel/useCarouselBlur';
import { useCarouselOpacity } from '@/components/shared/carousel/useCarouselOpacity';
import { useCarouselScale } from '@/components/shared/carousel/useCarouselScale';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import data from './data.json';
import Testimonial from './testimonial';

export function TestimonialCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useLayoutEffect(() => {
    if (!api)
      return;
    setCurrent(api.selectedScrollSnap() + 1);
  }, [api]);

  useEffect(() => {
    if (!api)
      return;

    const update = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on('reInit', update);
    api.on('select', update);

    return () => {
      api.off('reInit', update);
      api.off('select', update);
    };
  }, [api]);

  // Hooks to apply tweening effects
  useCarouselOpacity({ emblaApiNullable: api, options: { selector: '.landing__testimonial' } });
  useCarouselScale({ emblaApiNullable: api, options: { selector: '.landing__testimonial', offsetFactor: 0.7 } });
  useCarouselBlur({ emblaApiNullable: api, options: { selector: '.landing__testimonial', blurPx: 6 } });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, delay: 0.3 }}
      className="w-full"
    >
      <Carousel
        opts={{ loop: true, align: 'center' }}
        setApi={setApi}
        className="min-w-0"
      >
        <CarouselContent>
          {data.data.map((t) => {
            return (
              <CarouselItem key={t.name} className="px-3 basis-[90%] md:px-6 md:basis-[80%] lg:px-9 lg:basis-[70%] xl:px-20 xl:basis-[50%]">
                <Testimonial t={t} />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      <div className="flex justify-center mt-4 space-x-2">
        {(api?.scrollSnapList() ?? []).map((snap, index) => (
          <span
            key={`dot-${snap}`}
            className={`w-2 h-2 rounded-full ${current - 1 === index ? 'bg-primary' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </motion.div>
  );
}
