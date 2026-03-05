"use client";

import * as React from "react";
import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type ColumnResizeMode,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

import { Download, Filter, Printer, Columns, ChevronRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/* GLOBAL SEARCH FILTER                                               */
/* ------------------------------------------------------------------ */
const globalSearchFilter: FilterFn<any> = (row, _columnId, value) => {
  const search = String(value).toLowerCase();
  return Object.values(row.original).some((val) =>
    String(val).toLowerCase().includes(search),
  );
};

/* ------------------------------------------------------------------ */
/* COLUMN FILTER FUNCTION                                             */
/* ------------------------------------------------------------------ */
const columnFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  if (!filterValue || !Array.isArray(filterValue) || filterValue.length === 0) {
    return true;
  }

  const cellValue = row.getValue(columnId);
  const stringValue = String(cellValue).toLowerCase();

  return filterValue.some((filter: string) =>
    stringValue.includes(filter.toLowerCase())
  );
};

/* ------------------------------------------------------------------ */
/* GET UNIQUE VALUES FOR COLUMN                                       */
/* ------------------------------------------------------------------ */
function getUniqueValues<TData>(data: TData[], columnId: string): string[] {
  const values = new Set<string>();
  data.forEach((row) => {
    const value = (row as any)[columnId];
    if (value !== null && value !== undefined) {
      values.add(String(value));
    }
  });
  return Array.from(values).sort();
}

/* ------------------------------------------------------------------ */
/* CSV EXPORT                                                         */
/* ------------------------------------------------------------------ */
function exportToCSV<T>(rows: any[], filename = "export.csv") {
  if (!rows.length) return;

  const headers = Object.keys(rows[0].original);
  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((key) => JSON.stringify(row.original[key] ?? "")).join(","),
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ------------------------------------------------------------------ */
/* PROPS                                                              */
/* ------------------------------------------------------------------ */
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  initialColumnVisibility?: VisibilityState;
}

/* ------------------------------------------------------------------ */
/* DATA TABLE                                                         */
/* ------------------------------------------------------------------ */
export function DataTable<TData, TValue>({
  columns,
  data,
  initialColumnVisibility,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialColumnVisibility ?? {});
  const [columnCheckboxFilters, setColumnCheckboxFilters] = React.useState<Record<string, string[]>>({});
  const [openSubmenus, setOpenSubmenus] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (initialColumnVisibility) {
      setColumnVisibility(initialColumnVisibility);
    }
  }, [initialColumnVisibility]);

  // Combined filter that includes both global search and column checkbox filters
  const combinedFilter = React.useMemo(() => {
    return `${globalFilter}|||${JSON.stringify(columnCheckboxFilters)}`;
  }, [globalFilter, columnCheckboxFilters]);

  // Custom filter function that handles both global search and column checkbox filters
  const combinedFilterFn: FilterFn<any> = React.useCallback((row, _columnId, filterValue) => {
    const [searchTerm, checkboxFiltersStr] = String(filterValue).split('|||');
    const checkboxFilters = checkboxFiltersStr ? JSON.parse(checkboxFiltersStr) : {};

    // Check global search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const globalMatch = Object.values(row.original).some((val) =>
        String(val).toLowerCase().includes(search),
      );
      if (!globalMatch) return false;
    }

    // Check column-specific checkbox filters
    for (const [columnId, selectedValues] of Object.entries(checkboxFilters)) {
      if (Array.isArray(selectedValues) && selectedValues.length > 0) {
        const cellValue = row.getValue(columnId);
        const stringValue = String(cellValue).toLowerCase();
        const hasMatch = selectedValues.some((filter: string) =>
          stringValue.toLowerCase().includes(filter.toLowerCase())
        );
        if (!hasMatch) return false;
      }
    }

    return true;
  }, []);

  // Update table filter when filters change
  React.useEffect(() => {
    table.setGlobalFilter(combinedFilter);
  }, [combinedFilter]);

  const [columnResizeMode] =
    React.useState<ColumnResizeMode>("onChange");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter: combinedFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: () => {}, // We'll handle this manually
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: combinedFilterFn,
    columnResizeMode,
    enableColumnResizing: true,
  });

  // Update table filter when filters change
  React.useEffect(() => {
    table.setGlobalFilter(combinedFilter);
  }, [combinedFilter, table]);

  return (
    <div className="space-y-4 bg-gradient-to-b from-transparent to-transparent">

      {/* -------------------- TOOLBAR -------------------- */}
      <div className="flex items-center justify-between gap-2 flex-wrap p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Table Controls
        </div>
        <div className="flex items-center gap-2 flex-wrap">

          {/* COLUMN SHOW / HIDE */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                title="Show/Hide Columns"
                className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              > 
                <Columns size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end"
              className="w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 shadow-lg"
            >
              <DropdownMenuLabel className="text-gray-700 dark:text-gray-300">
                Columns
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              {table
                .getAllLeafColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                    className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {column.columnDef.header as string}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* FILTER BUTTON */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                title="Filter Columns"
                className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              >
                <Filter size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 max-w-none max-h-96 overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg p-0"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <div className="border-b border-gray-200 dark:border-gray-700">
                <DropdownMenuLabel className="text-gray-700 dark:text-gray-300 px-3 py-2 text-sm font-semibold">
                  Column Filters
                </DropdownMenuLabel>
              </div>

              {/* Clear All Filters Button */}
              <div className="px-2 py-2 border-b border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setColumnCheckboxFilters({})}
                  className="w-full text-xs bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                >
                  Clear All Filters
                </Button>
              </div>

              {/* Filter Column List */}
              <div className="space-y-0">
                {table
                  .getAllLeafColumns()
                  .filter((column) => column.getCanFilter())
                  .map((column) => {
                    const columnId = column.id;
                    const uniqueValues = getUniqueValues(data, columnId);
                    const selectedValues = columnCheckboxFilters[columnId] || [];
                    const hasSelectedFilters = selectedValues.length > 0;
                    const isOpen = openSubmenus.has(columnId);

                    return (
                      <div key={columnId} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                        {/* Column Header - Click to toggle */}
                        <div
                          className="px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between transition-colors\"
                          onClick={() => {
                            setOpenSubmenus(prev => {
                              const newSet = new Set(prev);
                              if (newSet.has(columnId)) {
                                newSet.delete(columnId);
                              } else {
                                newSet.add(columnId);
                              }
                              return newSet;
                            });
                          }}
                        >
                          <span className="flex items-center justify-between flex-1 gap-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {column.columnDef.header as string}
                            </span>
                            <div className="flex items-center gap-2">
                              {hasSelectedFilters && (
                                <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                                  {selectedValues.length}
                                </span>
                              )}
                              <ChevronRight
                                className={`w-4 h-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-90' : ''}`}
                              />
                            </div>
                          </span>
                        </div>

                        {/* Checkbox List - Show when column is open */}
                        {isOpen && (
                          <div className="bg-white dark:bg-gray-900 px-3 py-2 space-y-1">
                            {uniqueValues.length > 0 ? (
                              uniqueValues.map((value) => (
                                <label
                                  key={`${columnId}-${value}`}
                                  className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedValues.includes(value)}
                                    onChange={(e) => {
                                      setColumnCheckboxFilters(prev => {
                                        const currentFilters = { ...prev };
                                        if (e.target.checked) {
                                          currentFilters[columnId] = [...(currentFilters[columnId] || []), value];
                                        } else {
                                          currentFilters[columnId] = (currentFilters[columnId] || []).filter(v => v !== value);
                                          if (currentFilters[columnId].length === 0) {
                                            delete currentFilters[columnId];
                                          }
                                        }
                                        return currentFilters;
                                      });
                                    }}
                                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-500 bg-white dark:bg-gray-800 cursor-pointer"
                                  />
                                  <span className="text-xs text-gray-900 dark:text-gray-100 flex-1">
                                    {value}
                                  </span>
                                </label>
                              ))
                            ) : (
                              <div className="text-xs text-gray-500 dark:text-gray-400 py-1">
                                No values available
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* EXPORT BUTTON */}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              exportToCSV(table.getFilteredRowModel().rows)
            }
            title="Export to CSV"
            className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          >
            <Download size={14} />
          </Button>

          {/* PRINT BUTTON */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            title="Print Table"
            className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          >
            <Printer size={14} />
          </Button>

          {/* GLOBAL SEARCH */}
          <Input
            placeholder="Search all columns..."
            value={globalFilter}
            onChange={(e) =>
              setGlobalFilter(e.target.value)
            }
            className="w-60 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* -------------------- TABLE -------------------- */}
      <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto shadow-sm bg-white dark:bg-gray-900">
        <Table className="w-full table-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      position: "relative",
                    }}
                    className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-bold py-3 px-4"
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          className="cursor-pointer select-none hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: " ↑",
                            desc: " ↓",
                          }[
                            header.column.getIsSorted() as string
                          ] ?? null}
                        </div>

                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`absolute right-0 top-0 h-full w-1 bg-gray-300 dark:bg-gray-600 cursor-col-resize select-none touch-none hover:bg-blue-500 dark:hover:bg-blue-400 ${
                            header.column.getIsResizing()
                              ? "bg-blue-500 dark:bg-blue-400"
                              : ""
                          }`}
                        />
                      </>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={`${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800"
                  } text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                      }}
                      className="py-3 px-4"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

   
        </Table>
      </div>


      {/* -------------------- PAGINATION -------------------- */}
      <div className="flex justify-end items-center gap-4 flex-wrap p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <span>Rows per page:</span>
          <select
            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer hover:border-blue-500 dark:hover:border-blue-400"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
            className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {"<<"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {"<"}
          </Button>

          <span className="text-sm text-gray-700 dark:text-gray-300 px-2">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {">"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
            className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {">>"}
          </Button>
        </div>
      </div>

   
    </div>
  );
}