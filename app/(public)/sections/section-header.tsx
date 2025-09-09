import { motion } from 'motion/react';

interface SectionHeaderProps {
  title: string;
  description: string;
}

function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <motion.div
      className="text-center space-y-4 bg-card py-10 min-h-40 flex flex-col justify-center px-4"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">{title}</h2>
      <p className="text-muted-foreground">
        {description}
      </p>
    </motion.div>
  );
}

export default SectionHeader;
