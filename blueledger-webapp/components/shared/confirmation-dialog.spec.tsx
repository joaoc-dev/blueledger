import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { Dialog } from '@/components/ui/dialog';
import ConfirmationDialog from './confirmation-dialog';

// Note: Vitest watch mode + path alias mocking can sometimes cause flaky reloads.
// This test itself is correct; flakiness is due to module cache issues, not logic.
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, onClick, ...props }: any) => (
    <button
      {...props}
      type="button"
      onClick={onClick}
      data-variant={variant}
    >
      {children}
    </button>
  ),
}));

describe('confirmationDialog', () => {
  const mockOnConfirm = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should render with default props', () => {
      const { getByText } = render(
        <Dialog defaultOpen open>
          <ConfirmationDialog />
        </Dialog>,
      );

      expect(getByText('Dialog Title')).toBeInTheDocument();
      expect(getByText('Dialog description')).toBeInTheDocument();
      expect(getByText('Cancel')).toBeInTheDocument();
      expect(getByText('Confirm')).toBeInTheDocument();
    });

    it('should render with custom props', () => {
      const { getByText } = render(
        <Dialog defaultOpen open>
          <ConfirmationDialog
            title="Custom Title"
            description="Custom Description"
            cancelButtonText="No"
            confirmButtonText="Yes"
          />
        </Dialog>,
      );

      expect(getByText('Custom Title')).toBeInTheDocument();
      expect(getByText('Custom Description')).toBeInTheDocument();
      expect(getByText('No')).toBeInTheDocument();
      expect(getByText('Yes')).toBeInTheDocument();
    });

    it('should have proper button variants', () => {
      const { getByText } = render(
        <Dialog defaultOpen open>
          <ConfirmationDialog />
        </Dialog>,
      );

      const cancelButton = getByText('Cancel');
      const confirmButton = getByText('Confirm');

      expect(cancelButton).toBeInTheDocument();
      expect(confirmButton).toBeInTheDocument();

      // Check that the buttons have the correct styling attributes
      expect(cancelButton).toHaveAttribute('data-variant', 'outline');
      expect(confirmButton).toHaveAttribute('data-variant', 'destructive');
    });
  });

  describe('interactions', () => {
    it('should call onCancel when cancel button is clicked', async () => {
      const { getByText } = render(
        <Dialog defaultOpen open>
          <ConfirmationDialog onCancel={mockOnCancel} />
        </Dialog>,
      );

      const cancelButton = getByText('Cancel');
      await cancelButton.click();

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onConfirm when confirm button is clicked', async () => {
      const { getByText } = render(
        <Dialog defaultOpen open>
          <ConfirmationDialog onConfirm={mockOnConfirm} />
        </Dialog>,
      );

      const confirmButton = getByText('Confirm');
      await confirmButton.click();

      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });
  });
});
