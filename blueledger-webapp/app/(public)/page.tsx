import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="flex justify-center items-center h-screen">
      <Card className="w-[550px] mx-auto">
        <CardHeader>
          <CardTitle>Blue Ledger</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This will be the landing page for Blue Ledger.</p>
          <p>A platform for managing your finances.</p>
          <br />
          <p>
            With the help of AI, you can easily track your income and expenses.
          </p>
          <br />
          <p>
            Go to
            {' '}
            <Link href="/dashboard" className="underline">
              Dashboard
            </Link>
            {' '}
            to get started.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
