interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const HamburgerButton = ({ isOpen, onClick }: HamburgerButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center w-10 h-10"
    >
      <span
        className={`absolute h-0.5 w-5 bg-current rounded transition-transform duration-300 ease-in-out ${
          isOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
        }`}
      />
      <span
        className={`absolute h-0.5 w-5 bg-current rounded transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <span
        className={`absolute h-0.5 w-5 bg-current rounded transition-transform duration-300 ease-in-out ${
          isOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
        }`}
      />
    </button>
  );
};

export default HamburgerButton;
