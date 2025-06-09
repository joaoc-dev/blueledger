import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileNavMenuProps {
  links: { label: string; href: string }[];
  isOpen: boolean;
  onClose: () => void;
}

const MobileNavMenu = ({ links, isOpen, onClose }: MobileNavMenuProps) => {
  const pathname = usePathname();

  return (
    <>
      <ul
        className={`nav__list--mobile ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <li key={link.label}>
              <Link
                onClick={onClose}
                className={`nav__item px-6 py-2 hover:text-foreground ${
                  isActive
                    ? 'text-foreground border-l border-foreground'
                    : 'text-muted-foreground'
                }`}
                href={link.href}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default MobileNavMenu;
