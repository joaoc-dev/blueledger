import { Minus, Plus } from 'lucide-react';
import { NumericFormat } from 'react-number-format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface NumericInputProps {
  value?: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  // Formatting options
  decimalScale?: number;
  fixedDecimalScale?: boolean;
  thousandSeparator?: boolean | string;
  prefix?: string;
  suffix?: string;
  // Button behavior
  incrementSteps?: number[];
  decrementSteps?: number[];
  // Styling
  inputClassName?: string;
  buttonClassName?: string;
  containerClassName?: string;
  // Accessibility
  ariaLabel?: string;
  decrementAriaLabel?: string;
  incrementAriaLabel?: string;
  // Input behavior
  allowNegative?: boolean;
}

export function NumericInput({
  value,
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  min = 0,
  max = 999999,
  step = 1,
  decimalScale = 2,
  fixedDecimalScale = false,
  thousandSeparator = false,
  prefix = '',
  suffix = '',
  inputClassName = '',
  buttonClassName = '',
  containerClassName = '',
  ariaLabel = 'Numeric input',
  decrementAriaLabel = 'Decrease value',
  incrementAriaLabel = 'Increase value',
  allowNegative = false,
}: NumericInputProps) {
  const increment = () => {
    const currentValue = value || 0;
    const newValue = currentValue + step;
    if (newValue <= max) {
      onChange(Math.min(newValue, max));
    }
  };

  const decrement = () => {
    const currentValue = value || 0;
    const newValue = currentValue - step;
    if (newValue >= min) {
      onChange(Math.max(newValue, min));
    }
  };

  const handleInputChange = (values: any) => {
    const numValue = values.floatValue;
    if (numValue !== undefined && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
    else if (values.value === '') {
      onChange(0);
    }
  };

  const baseInputClassName = 'flex h-12 flex-1 rounded-md border border-input bg-background px-4 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation';
  const baseButtonClassName = 'h-12 w-12 p-0 shrink-0 touch-manipulation active:scale-95 transition-transform';

  return (
    <div className={`flex items-center space-x-2 ${containerClassName}`}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={decrement}
        disabled={disabled || (value || 0) <= min}
        className={`${baseButtonClassName} ${buttonClassName}`}
        aria-label={decrementAriaLabel}
      >
        <Minus className="h-4 w-4" />
      </Button>

      <NumericFormat
        customInput={Input}
        value={value}
        onValueChange={handleInputChange}
        onBlur={onBlur}
        allowNegative={allowNegative}
        decimalScale={decimalScale}
        fixedDecimalScale={fixedDecimalScale}
        thousandSeparator={thousandSeparator}
        prefix={prefix}
        suffix={suffix}
        placeholder={placeholder}
        disabled={disabled}
        className={`${baseInputClassName} ${inputClassName}`}
        style={{
          fontSize: '16px', // Prevents zoom on iOS
          minWidth: '100px',
          textAlign: 'center',
        }}
        aria-label={ariaLabel}
        inputMode="decimal"
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={increment}
        disabled={disabled || (value || 0) >= max}
        className={`${baseButtonClassName} ${buttonClassName}`}
        aria-label={incrementAriaLabel}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
