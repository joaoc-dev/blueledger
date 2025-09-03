'use client';

import { Plus } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Section } from '../section';
import FAQs from './data.json';

interface FaqItem {
  question: string;
  answer: string;
}

export function Faq() {
  return (
    <Section
      id="faq"
      title="Frequently Asked Questions"
      description="Everything you need to know about this demo."
    >
      <div className="landing__container px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <Accordion type="single" collapsible className="grid grid-cols-1">
            {FAQs.data.map((item: FaqItem) => (
              <AccordionFaqItem question={item.question} key={item.question}>
                <p>{item.answer}</p>
              </AccordionFaqItem>
            ))}

            <AccordionFaqItem question="How do I contact you?" key="How do I contact you?">
              <p>
                You can reach me at
                {' '}
                <a href="mailto:contact@joao-carvalho.dev" className="underline">
                  contact@joao-carvalho.dev
                </a>
              </p>
            </AccordionFaqItem>
          </Accordion>
        </div>
      </div>
    </Section>
  );
}

function AccordionFaqItem({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <AccordionItem value={question} key={question}>
      <AccordionTrigger className="px-4 hover:no-underline hover:bg-background [&>svg]:hidden group">
        <div className="flex flex-1 items-center justify-between py-2 font-medium">
          {question}
          <Plus
            aria-hidden="true"
            className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-[[data-state=open]]:rotate-45"
          />
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-5 pb-5 text-sm text-muted-foreground">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}
