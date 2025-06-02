const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-screen-xl mx-auto min-h-screen grid grid-rows-[auto_1fr] ">
      <header className="border-4 mb-20"></header>
      <main>{children}</main>
    </div>
  );
};

export default AuthLayout;
