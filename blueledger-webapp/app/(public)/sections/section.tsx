'use client';

import SectionHeader from './section-header';

interface SectionProps {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function Section({ id, title, description, children }: SectionProps) {
  return (
    <>
      <div className="landing__splitter" />
      <section id={id} className="landing__section landing__section--grid">

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
