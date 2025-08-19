import type { CarouselApi } from '@/components/ui/carousel';
import { useEffect } from 'react';

const TWEEN_FACTOR_BASE = 0.15;

function numberWithinRange(number: number, min: number, max: number): number {
  return Math.min(Math.max(number, min), max);
}

interface UseCarouselScaleOptions {
  selector?: string;
  offsetFactor?: number;
}

interface UseCarouselScaleProps {
  emblaApiNullable: CarouselApi | null;
  options?: UseCarouselScaleOptions;
}

export function useCarouselScale({ emblaApiNullable, options }: UseCarouselScaleProps): void {
  useEffect((): (() => void) | void => {
    if (!emblaApiNullable)
      return;

    const emblaApi = emblaApiNullable as NonNullable<CarouselApi>;
    const selector = options?.selector;
    const offsetFactor = options?.offsetFactor ?? 0.70; // 0..1, where 0.5 ~ keep near original edge
    let tweenFactor = 0;

    const setTweenNodes = (): HTMLElement[] => {
      const slides: Element[] = ((emblaApi as any).slideNodes() as Element[]) ?? [];
      return slides.map((slide) => {
        if (selector) {
          return (slide as HTMLElement).querySelector(selector) as HTMLElement;
        }
        return slide as HTMLElement;
      });
    };

    let tweenNodes: HTMLElement[] = setTweenNodes();

    const setTweenFactor = (): void => {
      tweenFactor = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
    };

    const tweenScale = (): void => {
      const engine = (emblaApi as any).internalEngine();
      const axis: 'x' | 'y' = engine?.options?.axis ?? 'x';
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();

      emblaApi.scrollSnapList().forEach((scrollSnap: number, snapIndex: number) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex: number) => {
          if (!slidesInView.includes(slideIndex))
            return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem: any) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor);
          const scale = numberWithinRange(tweenValue, 0, 1);
          const node = tweenNodes[slideIndex];
          if (!node)
            return;

          const signToCenter = Math.sign(diffToTarget) || 0; // right: +1, left: -1, centered: 0
          const translatePercent = -signToCenter * (1 - scale) * (offsetFactor * 100);

          if (axis === 'y') {
            node.style.transform = `translateY(${translatePercent}%) scale(${scale})`;
          }
          else {
            node.style.transform = `translateX(${translatePercent}%) scale(${scale})`;
          }
        });
      });
    };

    // Initial setup
    tweenNodes = setTweenNodes();
    setTweenFactor();
    tweenScale();

    const handleReInit = (): void => {
      tweenNodes = setTweenNodes();
      setTweenFactor();
      tweenScale();
    };

    emblaApi
      .on('reInit', handleReInit)
      .on('scroll', tweenScale)
      .on('slideFocus', tweenScale);

    const cleanup = (): void => {
      tweenNodes.forEach(slide => slide?.style && slide.removeAttribute('style'));
      (emblaApi as any).off?.('reInit', handleReInit);
      (emblaApi as any).off?.('scroll', tweenScale);
      (emblaApi as any).off?.('slideFocus', tweenScale);
    };

    emblaApi.on('destroy', cleanup);

    return () => {
      cleanup();
      (emblaApi as any).off?.('destroy', cleanup);
    };
  }, [emblaApiNullable, options?.selector, options?.offsetFactor]);
}
