import type { CarouselApi } from '@/components/ui/carousel';
import { useEffect } from 'react';

const TWEEN_FACTOR_BASE = 0.5;

function numberWithinRange(number: number, min: number, max: number): number {
  return Math.min(Math.max(number, min), max);
}

interface UseCarouselBlurOptions {
  selector?: string;
  blurPx?: number;
  factor?: number;
}

interface UseCarouselBlurProps {
  emblaApiNullable: CarouselApi | null;
  options?: UseCarouselBlurOptions;
}

export function useCarouselBlur({ emblaApiNullable, options }: UseCarouselBlurProps): void {
  useEffect((): (() => void) | void => {
    if (!emblaApiNullable)
      return;

    const emblaApi = emblaApiNullable as NonNullable<CarouselApi>;
    const selector = options?.selector;
    const blurPx = options?.blurPx ?? 2;
    const factor = options?.factor ?? TWEEN_FACTOR_BASE;

    const getNodes = (): HTMLElement[] => {
      const slides: Element[] = ((emblaApi as any).slideNodes() as Element[]) ?? [];
      return slides.map((slide) => {
        if (selector) {
          return (slide as HTMLElement).querySelector(selector) as HTMLElement;
        }
        return slide as HTMLElement;
      });
    };

    let nodes: HTMLElement[] = getNodes();
    let tweenFactor = 0;

    const setTweenFactor = (): void => {
      tweenFactor = factor * emblaApi.scrollSnapList().length;
    };

    const tweenBlur = (): void => {
      const engine = (emblaApi as any).internalEngine();
      const scrollProgress = emblaApi.scrollProgress();

      emblaApi.scrollSnapList().forEach((scrollSnap: number, snapIndex: number) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        // Loop compensation
        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem: any) => {
            const target = loopItem.target();
            slidesInSnap.forEach((slideIndex: number) => {
              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);
                if (sign === -1)
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                if (sign === 1)
                  diffToTarget = scrollSnap + (1 - scrollProgress);
              }
            });
          });
        }

        slidesInSnap.forEach((slideIndex: number) => {
          const node = nodes[slideIndex];
          if (!node)
            return;

          const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor);
          const clamped = numberWithinRange(tweenValue, 0, 1);
          const blur = blurPx * (1 - clamped);

          node.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : '';
        });
      });
    };

    const handleReInit = (): void => {
      nodes = getNodes();
      setTweenFactor();
      tweenBlur();
    };

    // Initial
    handleReInit();

    emblaApi
      .on('reInit', handleReInit)
      .on('scroll', tweenBlur)
      .on('slideFocus', tweenBlur);

    const cleanup = (): void => {
      nodes.forEach(n => n?.style?.removeProperty('filter'));
      (emblaApi as any).off?.('reInit', handleReInit);
      (emblaApi as any).off?.('scroll', tweenBlur);
      (emblaApi as any).off?.('slideFocus', tweenBlur);
    };

    emblaApi.on('destroy', cleanup);

    return () => {
      cleanup();
      (emblaApi as any).off?.('destroy', cleanup);
    };
  }, [emblaApiNullable, options?.selector, options?.blurPx, options?.factor]);
}
