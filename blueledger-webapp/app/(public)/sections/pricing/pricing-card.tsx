import Link from 'next/link';
import { Button } from '@/components/ui/button';

export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
}

function PricingCard({ plan, isFeatured }: {
  plan: PricingPlan;
  isFeatured: boolean;
}) {
  return (
    <div className={`grid grid-rows-[auto_1fr_auto] 
      rounded-lg border p-8 bg-card min-h-86 lg:min-h-100 
      ${isFeatured ? 'ring-1 ring-primary/30 shadow-xl scale-105' : 'shadow-sm'}`}
    >
      <div className={`flex items-baseline justify-between ${isFeatured ? 'text-primary' : ''}`}>
        <h3 className="text-xl md:text-2xl font-semibold">{plan.name}</h3>
        {isFeatured && <span className="text-xs px-2 py-1 rounded-full bg-primary/15">Popular</span>}
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4">
          {plan.price}
          <span className="text-sm font-normal text-muted-foreground">/mo</span>
        </p>
        <ul className="mt-5 space-y-2 text-sm text-muted-foreground list-disc list-inside">
          {plan.features.map(f => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        { isFeatured
          ? (
              <Button asChild variant="default" className="w-full">
                <Link href="/signup">Get started</Link>
              </Button>
            )
          : (
              <Button asChild variant="ghost" className="w-full border bg-foreground/3">
                <Link href="/signup">Get started</Link>
              </Button>
            )}
      </div>
    </div>
  );
}

export default PricingCard;
