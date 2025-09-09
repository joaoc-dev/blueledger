import { useTheme } from 'next-themes';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { ThemeToggle } from './theme-toggle';

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

describe('themeToggle', () => {
  const mockUseTheme = vi.mocked(useTheme);
  let mockSetTheme: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSetTheme = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('renders', () => {
    it('renders a button with proper accessibility attributes', () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
        themes: ['light', 'dark', 'system'],
      });

      const { getByRole } = render(<ThemeToggle />);
      const button = getByRole('button');

      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
    });

    it('renders both sun and moon icons', () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
        themes: ['light', 'dark', 'system'],
      });

      const { container } = render(<ThemeToggle />);

      const icons = container.querySelectorAll('svg');
      expect(icons).toHaveLength(2);

      const sunIcon = icons[0];
      const moonIcon = icons[1];

      // Both icons should be present in DOM
      expect(sunIcon).toBeInTheDocument();
      expect(moonIcon).toBeInTheDocument();

      // Check that they have the expected base classes
      expect(sunIcon).toHaveClass('h-6', 'w-6', 'rotate-0', 'scale-100');
      expect(moonIcon).toHaveClass('absolute', 'h-6', 'w-6', 'rotate-90', 'scale-0');

      // Check for dark mode classes (these are always present but only active in dark mode)
      expect(sunIcon).toHaveClass('dark:-rotate-90', 'dark:scale-0');
      expect(moonIcon).toHaveClass('dark:rotate-0', 'dark:scale-100');
    });
  });

  describe('theme toggling', () => {
    it('light theme toggles to dark', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
        themes: ['light', 'dark', 'system'],
      });

      const { getByRole } = render(<ThemeToggle />);
      const button = getByRole('button');
      await button.click();

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });

    it('dark theme toggles to light', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
        themes: ['light', 'dark', 'system'],
      });

      const { getByRole } = render(<ThemeToggle />);
      const button = getByRole('button');
      await button.click();

      expect(mockSetTheme).toHaveBeenCalledWith('light');
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });

    it('handles undefined theme gracefully switching to dark', async () => {
      mockUseTheme.mockReturnValue({
        theme: undefined,
        setTheme: mockSetTheme,
        themes: ['light', 'dark', 'system'],
      });

      const { getByRole } = render(<ThemeToggle />);
      const button = getByRole('button');

      await button.click();

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });

    it('handles system theme gracefully switching to dark', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'system',
        setTheme: mockSetTheme,
        themes: ['light', 'dark', 'system'],
      });

      const { getByRole } = render(<ThemeToggle />);
      const button = getByRole('button');

      await button.click();

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });
  });
});
