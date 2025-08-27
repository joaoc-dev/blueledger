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
    <Card className="rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>{title}</CardTitle>
        </div>
        {headerOptions && (
          <div>
            {headerOptions}
          </div>
        )}
      </CardHeader>
      <CardContent className="pl-2 pr-2">
        {children}
      </CardContent>
    </Card>
  );
}

export default ChartCardContainer;
