'use client';

import React from 'react';

type FormatType = 'number' | 'currency' | 'percent' | 'compact';

interface NumericDisplayProps {
  value: number;
  format?: FormatType;
  currency?: string;
  locale?: string;
  className?: string;
}

const NumericDisplay = ({
  value,
  format = 'number',
  currency = 'EUR',
  locale = 'en-US',
  className = '',
}: NumericDisplayProps) => {
  const formatter = new Intl.NumberFormat(locale, {
    style:
      format === 'currency'
        ? 'currency'
        : format === 'percent'
        ? 'percent'
        : 'decimal',
    currency: format === 'currency' ? currency : undefined,
    notation: format === 'compact' ? 'compact' : undefined,
    maximumFractionDigits: format === 'percent' ? 2 : 0,
  });

  return (
    <div className={`truncate ${className}`}>{formatter.format(value)}</div>
  );
};

export default NumericDisplay;
