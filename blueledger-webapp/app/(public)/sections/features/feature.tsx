import { motion } from 'motion/react';
import Image from 'next/image';

interface FeatureItem {
  title: string;
  desc: string;
  imageSrc?: string;
}

function Feature({ item, isEven }: { item: FeatureItem; isEven: boolean }) {
  return (
    <div className="grid md:grid-cols-2 gap-10 items-center w-full xl:max-w-none xl:grid-cols-1">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
        className={`${isEven ? 'md:order-2' : 'md:order-1'}`}
      >
        <FeatureHeader title={item!.title} desc={item!.desc} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: isEven ? -24 : 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`${isEven ? 'md:order-1' : 'md:order-2'} relative w-full h-44 xl:h-40 overflow-hidden`}
      >
        <Image src={item!.imageSrc!} alt={item!.title} fill className="object-contain" />
      </motion.div>
    </div>
  );
}

export default Feature;

function FeatureHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-3">{desc}</p>
    </div>
  );
}
