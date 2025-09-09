'use client';

import { Section } from '../section';
import FEATURES from './data.json';
import Feature from './feature';

export function Features() {
  return (
    <Section
      id="features"
      title="Smarter tools"
      description="A focused look at our core features."
    >
      <div className="landing__container px-6 py-16 flex items-center justify-center">
        <div className="grid grid-cols-1 gap-20 xl:grid-cols-6 xl:grid-rows-2 xl:gap-14">
          <div className="w-full xl:justify-self-center xl:max-w-sm xl:col-start-1 xl:col-span-2 xl:row-start-1">
            <Feature item={FEATURES.data[0]!} isEven={true} />
          </div>
          <div className="w-full xl:justify-self-center xl:max-w-sm xl:col-start-2 xl:col-span-2 xl:row-start-2">
            <Feature item={FEATURES.data[1]!} isEven={false} />
          </div>
          <div className="w-full xl:justify-self-center xl:max-w-sm xl:col-start-4 xl:col-span-2 xl:row-start-1">
            <Feature item={FEATURES.data[2]!} isEven={true} />
          </div>
          <div className="w-full xl:justify-self-center xl:max-w-sm xl:col-start-5 xl:col-span-2 xl:row-start-2">
            <Feature item={FEATURES.data[3]!} isEven={false} />
          </div>
        </div>
      </div>
    </Section>
  );
}
