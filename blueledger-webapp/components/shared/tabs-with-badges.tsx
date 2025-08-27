import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabsWithBadgesProps {
  tabs: {
    label: string;
    value: string;
    content: React.ReactNode;
    badge?: number;
  }[];
  onTabChange?: (tab: string) => void;
}

export function TabsWithBadges({ tabs, onTabChange }: TabsWithBadgesProps) {
  const tabClass = [
    'flex flex-none shrink-0 items-center gap-2',
    'px-3 py-1 text-xs border-0',
    'hover:[&>*]:text-foreground hover:cursor-pointer hover:bg-transparent',
    'transition-colors duration-200',

    // Position the underline
    'relative',
    'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent',
    'data-[state=active]:after:bg-foreground',
  ].join(' ');

  return (
    <Tabs defaultValue={tabs[0]?.value} className="flex w-full flex-col">
      <TabsList className="inline-flex w-full p-0 bg-background justify-start border-b rounded-none gap-1">

        {tabs.map(tab => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            onClick={() => { onTabChange?.(tab.value); }}
            className={tabClass}
          >
            <span className="text-xs">{tab.label}</span>
            <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs rounded-full">{tab.badge}</Badge>
          </TabsTrigger>
        ))}

      </TabsList>

      {tabs.map(tab => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}

    </Tabs>
  );
}
