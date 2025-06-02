import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <Card className="w-[550px] mx-auto">
      <CardHeader>
        <CardTitle>Blue Ledger</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Blue Ledger is a platform for managing your finances.</p>
        <p>
          With the help of AI, you can easily track your income and expenses.
        </p>
        <p>Coming soon...</p>
      </CardContent>
    </Card>
  );
}
