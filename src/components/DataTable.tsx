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
} from "@/components/ui/dropdown-menu";

import { Download, Filter, Printer } from "lucide-react";

/* ------------------------------------------------------------------ */
/* GLOBAL SEARCH FILTER (ID, NAME, EMAIL, ETC.)                         */
/* ------------------------------------------------------------------ */
const globalSearchFilter: FilterFn<any> = (row, _columnId, value) => {
  const search = String(value).toLowerCase();
  return Object.values(row.original).some((val) =>
    String(val).toLowerCase().includes(search),
  );
};

/* ------------------------------------------------------------------ */
/* CSV EXPORT                                                          */
/* ------------------------------------------------------------------ */
function exportToCSV<T>(rows: any[], filename = "users.csv") {
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
/* DATA TABLE COMPONENT                                                */
/* ------------------------------------------------------------------ */
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnResizeMode] = React.useState<ColumnResizeMode>("onChange");

  const table = useReactTable({
    data,
    columns,

    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
    },

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    globalFilterFn: globalSearchFilter,

    // Enable column resizing
    columnResizeMode,
    enableColumnResizing: true,
  });

  return (
    <div className="space-y-4">
      {/* ---------------------------------------------------------------- */}
      {/* TOOLBAR                                                          */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Global Search */}
        <Input
          placeholder="Search users..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        <div className="flex items-center gap-2">
          {/* Column visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))} */}
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
    >
      {column.columnDef.header as string}
    </DropdownMenuCheckboxItem>
  ))}
 





            </DropdownMenuContent>
          </DropdownMenu>

          {/* Download CSV */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToCSV(table.getFilteredRowModel().rows)}
          >
            <Download size={14} />
          </Button>

          {/* Print */}
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer size={14} />
          </Button>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* TABLE                                                            */}
      {/* ---------------------------------------------------------------- */}
      <div className="rounded-md border overflow-x-auto">
        <Table style={{ width: table.getTotalSize(),tableLayout: "fixed" }}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                {/* Column Headers Row */}
                <TableRow>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.getSize(),
                        position: "relative",
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className="cursor-pointer select-none"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {{
                              asc: " ↑",
                              desc: " ↓",
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                          {/* Column Resizer */}
                          <div
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className={`absolute right-0 top-0 h-full w-1 bg-gray-300 cursor-col-resize select-none touch-none hover:bg-blue-500 ${
                              header.column.getIsResizing() ? "bg-blue-500" : ""
                            }`}
                          />
                        </>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
                {/* Column Filters Row */}
                <TableRow>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={`${header.id}-filter`}
                      style={{
                        width: header.getSize(),
                      }}
                    >
                      {header.column.getCanFilter() && !header.isPlaceholder ? (
                        <Input
                          placeholder={`Filter ${header.column.id}...`}
                          value={
                            (header.column.getFilterValue() as string) ?? ""
                          }
                          onChange={(e) =>
                            header.column.setFilterValue(e.target.value)
                          }
                          className="h-8 text-xs"
                        />
                      ) : null}
                    </TableHead>
                  ))}
                </TableRow>
              </React.Fragment>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, index) => (
                // <TableRow
                //   key={row.id}
                //   className={index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}
                // >
                <TableRow
                  key={row.id}
                  className={
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800"
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                      }}
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
                <TableCell colSpan={columns.length} className="text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {/* Footer with Column Headers */}
          <TableFooter>
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  // <TableHead
                  //   key={header.id}
                  //   style={{
                  //     width: header.getSize(),
                  //   }}
                  //   className="font-semibold"
                  // >
                  //   {header.isPlaceholder
                  //     ? null
                  //     : flexRender(
                  //         header.column.columnDef.header,
                  //         header.getContext(),
                  //       )}
                  // </TableHead>

                  <TableHead
                    key={header.id}
                    style={{
                      width: header.column.getSize(),
                      minWidth: header.column.getSize(),
                      maxWidth: header.column.getSize(),
                    }}
                    className="font-semibold whitespace-nowrap"
                  >

                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableFooter>
        </Table>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* PAGINATION                                                       */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Rows per page */}
        <div className="flex items-center gap-2 text-sm">
          Rows per page:
          <select
            className="border rounded px-2 py-1"
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

        {/* Page controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>

          <span className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
        </div>
      </div>
    </div>
  );
}
