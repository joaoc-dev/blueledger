import { SessionProvider } from 'next-auth/react';

async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="dark bg-background flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <SessionProvider>
        {children}
      </SessionProvider>
    </main>
  );
}

export default AuthLayout;
