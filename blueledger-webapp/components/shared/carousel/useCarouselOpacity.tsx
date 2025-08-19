import type { CarouselApi } from '@/components/ui/carousel';
import { useEffect } from 'react';

const TWEEN_FACTOR_BASE = 0.4;

function numberWithinRange(number: number, min: number, max: number): number {
  return Math.min(Math.max(number, min), max);
}

interface UseCarouselOpacityOptions {
  selector?: string;
  factor?: number;
}

interface UseCarouselOpacityProps {
  emblaApiNullable: CarouselApi | null;
  options?: UseCarouselOpacityOptions;
}

export function useCarouselOpacity({ emblaApiNullable, options }: UseCarouselOpacityProps): void {
  useEffect((): (() => void) | void => {
    if (!emblaApiNullable)
      return;

    const emblaApi = emblaApiNullable as NonNullable<CarouselApi>;
    const selector = options?.selector;
    const factor = options?.factor ?? TWEEN_FACTOR_BASE;
    let tweenFactor = 0;

    const getNodes = (): (HTMLElement | null)[] => {
      const slides: Element[] = ((emblaApi as any).slideNodes() as Element[]) ?? [];
      return slides.map((slide) => {
        if (selector) {
          return (slide as HTMLElement).querySelector(selector) as HTMLElement | null;
        }
        return slide as HTMLElement;
      });
    };
    let nodes: (HTMLElement | null)[] = getNodes();

    const setTweenFactor = (): void => {
      tweenFactor = factor * emblaApi.scrollSnapList().length;
    };

    const tweenOpacity = (): void => {
      const engine = (emblaApi as any).internalEngine();
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
          const opacity = numberWithinRange(tweenValue, 0, 1).toString();
          const node = nodes[slideIndex];
          if (!node)
            return;
          node.style.opacity = opacity;
        });
      });
    };

    // Initial setup
    const handleReInit = (): void => {
      nodes = getNodes();
      setTweenFactor();
      tweenOpacity();
    };
    handleReInit();

    // Event listeners
    emblaApi
      .on('reInit', handleReInit)
      .on('scroll', tweenOpacity)
      .on('slideFocus', tweenOpacity);

    const cleanup = (): void => {
      nodes.forEach(n => n?.style?.removeProperty('opacity'));
      // Remove listeners
      (emblaApi as any).off?.('reInit', handleReInit);
      (emblaApi as any).off?.('scroll', tweenOpacity);
      (emblaApi as any).off?.('slideFocus', tweenOpacity);
    };

    // Also cleanup on destroy
    emblaApi.on('destroy', cleanup);

    return () => {
      cleanup();
      (emblaApi as any).off?.('destroy', cleanup);
    };
  }, [emblaApiNullable, options?.selector, options?.factor]);
}
