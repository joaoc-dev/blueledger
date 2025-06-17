import NavBar from '@/components/nav-bar';
import AuthRedirectClient from '@/components/shared/auth-redirect-client';
import { auth } from '@/lib/auth/auth';

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session || !session.user) return <AuthRedirectClient />;

  return (
    <div className="max-w-screen-xl mx-auto min-h-screen grid grid-rows-[auto_1fr] ">
      <header className="mb-20">
        <NavBar />
      </header>
      <main className="p-10">{children}</main>
    </div>
  );
};

export default AuthLayout;
