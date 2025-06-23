const ExpensesLayout = ({
  children,
  modal,
}: {
  children: React.ReactNode;
  throwaway: React.ReactNode;
  modal: React.ReactNode;
}) => {
  return (
    <div>
      {children}
      {modal}
    </div>
  );
};

export default ExpensesLayout;
