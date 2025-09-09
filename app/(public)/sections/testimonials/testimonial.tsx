import Image from 'next/image';

interface TestimonialType {
  image: string;
  name: string;
  title: string;
  quote: string;
}

function Testimonial({ t }: { t: TestimonialType }) {
  return (
    <div className="landing__testimonial">
      <Image src={t.image} alt={t!.name} width={64} height={64} className="rounded-full" />

      <div className="mt-4 md:mt-6 pt-4 md:pt-6 overflow-hidden h-full flex flex-col justify-between">
        <p className="text-base md:text-lg lg:text-xl">{t!.quote}</p>

        <div className="flex items-center justify-between w-full">
          <p className="font-medium text-primary">
            {t!.name}
            ,
          </p>
          <p className="text-sm text-muted-foreground">{t!.title}</p>
        </div>
      </div>
    </div>
  );
}

export default Testimonial;
