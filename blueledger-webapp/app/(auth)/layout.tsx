import NavBar from './nav-bar';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
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
