'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  mobile?: boolean; // Show on mobile
}

interface MobileDataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  title?: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  rowsPerPage?: number;
}

export function MobileDataTable<T extends { id: string }>({
  columns,
  data,
  title,
  searchPlaceholder = 'Search...',
  onSearch,
  rowsPerPage = 10,
}: MobileDataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    onSearch?.(query);
  };

  const filteredData = data.filter((row) =>
    columns.some((col) => {
      const value = row[col.key];
      return (
        value &&
        value
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    })
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const displayedData = filteredData.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // Mobile columns - show important ones first
  const mobileColumns = columns.filter(col => col.mobile !== false);
  const desktopColumns = columns;

  return (
    <div className="space-y-4">
      {(title || onSearch) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-0">
          {title && (
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          )}
          {onSearch && (
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full sm:w-auto pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          )}
        </div>
      )}

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3 px-4">
        {displayedData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No data found</p>
          </div>
        ) : (
          displayedData.map((row) => (
            <div
              key={row.id}
              className="bg-card border border-border rounded-lg p-4 space-y-3"
            >
              {mobileColumns.map((col) => (
                <div key={String(col.key)} className="flex flex-col">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    {col.label}
                  </p>
                  <p className="text-sm font-semibold text-foreground break-words">
                    {col.render ? col.render(row[col.key], row) : (row[col.key] as React.ReactNode)}
                  </p>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block border border-border rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {desktopColumns.map((col) => (
                  <th
                    key={String(col.key)}
                    style={{ width: col.width }}
                    className="px-4 sm:px-6 py-3 text-left font-medium text-muted-foreground text-xs sm:text-sm"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayedData.length === 0 ? (
                <tr>
                  <td colSpan={desktopColumns.length} className="px-6 py-8 text-center">
                    <p className="text-muted-foreground">No data found</p>
                  </td>
                </tr>
              ) : (
                displayedData.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border hover:bg-muted/30 transition-colors duration-150"
                  >
                    {desktopColumns.map((col) => (
                      <td key={String(col.key)} className="px-4 sm:px-6 py-4 text-xs sm:text-sm">
                        {col.render ? col.render(row[col.key], row) : (row[col.key] as React.ReactNode)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-0 py-3">
          <p className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
            Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredData.length)} of{' '}
            {filteredData.length} results
          </p>
          <div className="flex gap-1 sm:gap-2 justify-center sm:justify-end order-1 sm:order-2 min-h-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-muted rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-10 min-w-10"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const pageNum = i + 1;
                const isEllipsis = totalPages > 5 && i === 4;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-2 py-1 text-xs sm:text-sm rounded transition-colors min-h-10 min-w-10 ${
                      currentPage === pageNum
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {isEllipsis ? '...' : pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-muted rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-10 min-w-10"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
