'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function ChartCardContainer({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pl-2 pr-2">
        {children}
      </CardContent>
    </Card>
  );
}

export default ChartCardContainer;
