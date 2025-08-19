'use client';

import SectionHeader from './section-header';

interface SectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function Section({ title, description, children }: SectionProps) {
  return (
    <>
      <div className="landing__splitter" />
      <section id="features" className="landing__section landing__section--grid">

        <div className="landing__container">
          <SectionHeader
            title={title}
            description={description}
          />
        </div>

        <div className="landing__splitter" />

        {children}
      </section>
    </>
  );
}
