import { Table, TableBody, TableHeader } from '@/components/ui/table';
import { ColumnDef, Table as TableType } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { TABLE_CONFIG } from './constants';
import { Headers } from './headers';
import { Rows } from './rows';

interface TableProps<T> {
  table: TableType<T>;
  isLoading?: boolean;
  isFetching?: boolean;
  columns: ColumnDef<T>[];
  columnRefs: React.RefObject<Map<string, HTMLTableCellElement>>;
}

const TableElement = <T,>({
  table,
  isLoading,
  isFetching,
  columns,
  columnRefs,
}: TableProps<T>) => {
  const totalHeight = TABLE_CONFIG.ROWS_PER_PAGE * TABLE_CONFIG.ROW_HEIGHT;

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
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

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
          {table.getState().columnSizingInfo.isResizingColumn ? (
            <MemoizedRows
              isLoading={isLoading}
              columns={columns}
              table={table}
            />
          ) : (
            <Rows isLoading={isLoading} columns={columns} table={table} />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableElement;

const MemoizedRows = React.memo(
  Rows,
  (prevProps, nextProps) =>
    prevProps.table.options.data === nextProps.table.options.data
) as typeof Rows;
