'use client';

import React from 'react';

type FormatType = 'number' | 'currency' | 'percent' | 'compact';

interface NumericDisplayProps {
  value: number;
  format?: FormatType;
  currency?: string;
  locale?: string;
  className?: string;
  maximumFractionDigits?: number;
}

function NumericDisplay({
  value,
  format = 'number',
  currency = 'EUR',
  locale = 'en-US',
  className = '',
  maximumFractionDigits,
}: NumericDisplayProps) {
  const options: Intl.NumberFormatOptions = {
    style: format === 'currency' ? 'currency' : format === 'percent' ? 'percent' : 'decimal',
    currency: format === 'currency' ? currency : undefined,
    notation: format === 'compact' ? 'compact' : undefined,
  };

  if (typeof maximumFractionDigits === 'number') {
    options.maximumFractionDigits = maximumFractionDigits;
    options.minimumFractionDigits = maximumFractionDigits;
  }
  else if (format === 'percent') {
    options.maximumFractionDigits = 2;
  }

  const formatter = new Intl.NumberFormat(locale, options);

  return (
    <div className={`truncate ${className}`}>{formatter.format(value)}</div>
  );
}

export default NumericDisplay;
