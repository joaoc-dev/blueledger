import { Slider } from '@/components/ui/slider';
import { Column, Table } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

interface RangeFilterProps<TData, TValue> {
  table: Table<TData>;
  column: Column<TData, TValue>;
  title?: string;
}

const NumericRangeFilter = <TData, TValue>({
  table,
  column,
  title,
}: RangeFilterProps<TData, TValue>) => {
  const [range, setRange] = useState<[number, number] | null>(null);

  const allRows = table.getCoreRowModel().flatRows;

  const globalValues = allRows
    .map((row) => row.getValue(column.id))
    .filter((v): v is number => typeof v === 'number');

  const min = globalValues.length ? Math.min(...globalValues) : 0;
  const max = globalValues.length ? Math.max(...globalValues) : 0;
  const possibleRange = [min, max];

  useEffect(() => {
    const filterValue = column.getFilterValue() as [number, number] | null;

    const newRange: [number, number] = [
      filterValue?.[0] ?? min,
      filterValue?.[1] ?? max,
    ];

    if (!range || range[0] !== newRange[0] || range[1] !== newRange[1]) {
      setRange(newRange);
    }
  }, [table.getState().columnFilters]);

  const handleChange = (value: [number, number]) => {
    setRange(value);

    if (min == null || max == null) {
      // Can't apply filter without valid range
      column.setFilterValue(undefined);
      return;
    }

    // Clear the filter if full range is selected
    const isFilterCleared =
      min != null && max != null && value[0] === min && value[1] === max;

    if (isFilterCleared) {
      column.setFilterValue(undefined);
    } else {
      column.setFilterValue(value);
    }
  };

  return (
    <div className="w-full max-w-sm mb-2">
      <div className="flex items-center gap-2 justify-between mb-2">
        <span>{title}</span>
        <span className="text-sm text-muted-foreground">
          {range ? `${range[0]} - ${range[1]}` : ''}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        value={range ?? [min ?? 0, max ?? 0]}
        onValueChange={(val) => setRange(val as [number, number])}
        onValueCommit={handleChange}
        disabled={!possibleRange}
      />
    </div>
  );
};

export default NumericRangeFilter;
