import type { Table as TableType } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { Table, TableBody, TableHeader } from '@/components/ui/table';
import { TABLE_CONFIG } from './constants';
import { Headers } from './headers';
import { Rows } from './rows';

const MemoizedRows = React.memo(
  Rows,
  (prevProps, nextProps) =>
    prevProps.table.options.data === nextProps.table.options.data,
) as typeof Rows;

interface TableProps<T> {
  table: TableType<T>;
  isLoading?: boolean;
  isFetching?: boolean;
  columnRefs: React.RefObject<Map<string, HTMLTableCellElement>>;
}

function TableElement<T,>({
  table,
  isLoading,
  isFetching,
  columnRefs,
}: TableProps<T>) {
  const totalHeight = TABLE_CONFIG.ROWS_PER_PAGE * TABLE_CONFIG.ROW_HEIGHT;

  const columnSizingInfo = table.getState().columnSizingInfo;
  const columnSizing = table.getState().columnSizing;

  /**
   * Instead of calling `column.getSize()` on every render for every header
   * and especially every data cell (very expensive),
   * we will calculate all column sizes at once at the root table level in a useMemo
   * and pass the column sizes down as CSS variables to the <table> element.
   */

  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: number } = {};

    for (const header of headers) {
      if (header.column.id !== 'filler') {
        colSizes[`--header-${header.id}-size`] = header.getSize();
        colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
      }
    }

    return colSizes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnSizingInfo, columnSizing]);

  return (
    <div className="rounded-md border grid">
      <Table
        className="table-fixed"
        style={{
          ...columnSizeVars,
        }}
      >
        <TableHeader>
          <Headers<T>
            table={table}
            columnRefs={columnRefs}
            isLoading={isLoading}
            isFetching={isFetching}
          />
        </TableHeader>
        <TableBody style={{ height: `${totalHeight}px` }}>
          {table.getState().columnSizingInfo.isResizingColumn
            ? (
                <MemoizedRows
                  isLoading={isLoading}
                  table={table}
                />
              )
            : (
                <Rows isLoading={isLoading} table={table} />
              )}
        </TableBody>
      </Table>
    </div>
  );
}

export default TableElement;
