import React from 'react';
import ResponsiveTable from './ResponsiveTable';
import TableSkeleton from './TableSkeleton';
import EmptyState from './EmptyState';
import Pagination from './Pagination';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  emptyState?: React.ReactNode;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  className?: string;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  rows,
  loading = false,
  emptyState,
  pagination,
  className = '',
}: DataTableProps<T>) {
  if (loading) {
    return <TableSkeleton cols={columns.length} rows={5} />;
  }

  if (rows.length === 0) {
    return (
      <div className="w-full border border-border/80 rounded-xl p-8 bg-surface text-center shadow-sm">
        {emptyState || <EmptyState />}
      </div>
    );
  }

  return (
    <div className={`w-full flex flex-col gap-4 ${className}`}>
      <ResponsiveTable>
        <thead className="bg-background/80 text-foreground/80 font-bold border-b border-border/80 text-xs">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 font-semibold ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {rows.map((row, rIdx) => (
            <tr
              key={row.id || rIdx}
              className="hover:bg-primary/[0.01] transition-all"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3.5 text-xs text-foreground/80 ${col.className || ''}`}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </ResponsiveTable>

      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
}
