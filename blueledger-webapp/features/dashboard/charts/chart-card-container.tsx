'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function ChartCardContainer({
  title,
  children,
  headerOptions,
}: {
  title: string;
  children: React.ReactNode;
  headerOptions?: React.ReactNode;
}) {
  return (
    <Card className="rounded-lg h-96 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0.5 px-3">
        <div>
          <CardTitle>{title}</CardTitle>
        </div>
        {headerOptions && (
          <div>
            {headerOptions}
          </div>
        )}
      </CardHeader>
      <CardContent className="px-3 h-full pb-1.5 pt-0.5">
        {children}
      </CardContent>
    </Card>
  );
}

export default ChartCardContainer;
