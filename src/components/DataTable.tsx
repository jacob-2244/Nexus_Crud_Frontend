// // "use client";

// // import * as React from "react";
// // import {
// //   ColumnDef,
// //   FilterFn,
// //   flexRender,
// //   getCoreRowModel,
// //   getFilteredRowModel,
// //   getPaginationRowModel,
// //   getSortedRowModel,
// //   useReactTable,
// //   type SortingState,
// //   type ColumnFiltersState,
// //   type VisibilityState,
// //   type ColumnResizeMode,
// // } from "@tanstack/react-table";

// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// //   TableFooter,
// // } from "@/components/ui/table";
// // import { Input } from "@/components/ui/input";
// // import { Button } from "@/components/ui/button";

// // import {
// //   DropdownMenu,
// //   DropdownMenuCheckboxItem,
// //   DropdownMenuContent,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu";

// // import { Download, Filter, Printer } from "lucide-react";

// // /* ------------------------------------------------------------------ */
// // /* GLOBAL SEARCH FILTER                                               */
// // /* ------------------------------------------------------------------ */
// // const globalSearchFilter: FilterFn<any> = (row, _columnId, value) => {
// //   const search = String(value).toLowerCase();
// //   return Object.values(row.original).some((val) =>
// //     String(val).toLowerCase().includes(search),
// //   );
// // };

// // /* ------------------------------------------------------------------ */
// // /* CSV EXPORT                                                         */
// // /* ------------------------------------------------------------------ */
// // function exportToCSV<T>(rows: any[], filename = "users.csv") {
// //   if (!rows.length) return;

// //   const headers = Object.keys(rows[0].original);
// //   const csv = [
// //     headers.join(","),
// //     ...rows.map((row) =>
// //       headers.map((key) => JSON.stringify(row.original[key] ?? "")).join(","),
// //     ),
// //   ].join("\n");

// //   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
// //   const url = URL.createObjectURL(blob);

// //   const link = document.createElement("a");
// //   link.href = url;
// //   link.setAttribute("download", filename);
// //   document.body.appendChild(link);
// //   link.click();
// //   document.body.removeChild(link);
// // }

// // /* ------------------------------------------------------------------ */
// // /* PROPS                                                              */
// // /* ------------------------------------------------------------------ */
// // interface DataTableProps<TData, TValue> {
// //   columns: ColumnDef<TData, TValue>[];
// //   data: TData[];
// //   initialColumnVisibility?: VisibilityState;
// // }

// // /* ------------------------------------------------------------------ */
// // /* GET UNIQUE VALUES FOR DROPDOWN FILTER                              */
// // /* ------------------------------------------------------------------ */
// // const getUniqueValues = (data: any[], key: string) => {
// //   return [...new Set(data.map((item) => item[key]).filter(Boolean))];
// // };

// // /* ------------------------------------------------------------------ */
// // /* DATA TABLE                                                         */
// // /* ------------------------------------------------------------------ */
// // export function DataTable<TData, TValue>({
// //   columns,
// //   data,
// //   initialColumnVisibility,
// // }: DataTableProps<TData, TValue>) {
// //   const [sorting, setSorting] = React.useState<SortingState>([]);
// //   const [columnFilters, setColumnFilters] =
// //     React.useState<ColumnFiltersState>([]);
// //   const [globalFilter, setGlobalFilter] = React.useState("");
// //   const [columnVisibility, setColumnVisibility] =
// //     React.useState<VisibilityState>(initialColumnVisibility ?? {});

// //   React.useEffect(() => {
// //     if (initialColumnVisibility) {
// //       setColumnVisibility(initialColumnVisibility);
// //     }
// //   }, [initialColumnVisibility]);

// //   const [columnResizeMode] =
// //     React.useState<ColumnResizeMode>("onChange");

// //   const table = useReactTable({
// //     data,
// //     columns,
// //     state: {
// //       sorting,
// //       columnFilters,
// //       globalFilter,
// //       columnVisibility,
// //     },
// //     onSortingChange: setSorting,
// //     onColumnFiltersChange: setColumnFilters,
// //     onGlobalFilterChange: setGlobalFilter,
// //     onColumnVisibilityChange: setColumnVisibility,
// //     getCoreRowModel: getCoreRowModel(),
// //     getSortedRowModel: getSortedRowModel(),
// //     getFilteredRowModel: getFilteredRowModel(),
// //     getPaginationRowModel: getPaginationRowModel(),
// //     globalFilterFn: globalSearchFilter,
// //     columnResizeMode,
// //     enableColumnResizing: true,
// //   });

// //   return (
// //     <div className="space-y-4">

// //       {/* -------------------- TOOLBAR -------------------- */}
// //       <div className="flex items-center justify-end">
// //         <div className="flex items-center gap-2">

// //           {/* Column Visibility */}
// //           <DropdownMenu>
// //             <DropdownMenuTrigger asChild>
// //               <Button variant="outline" size="sm">
// //                 <Filter size={14} />
// //               </Button>
// //             </DropdownMenuTrigger>
// //             <DropdownMenuContent align="start">
// //               {table
// //                 .getAllLeafColumns()
// //                 .filter((column) => column.getCanHide())
// //                 .map((column) => (
// //                   <DropdownMenuCheckboxItem
// //                     key={column.id}
// //                     checked={column.getIsVisible()}
// //                     onCheckedChange={(value) =>
// //                       column.toggleVisibility(!!value)
// //                     }
// //                   >
// //                     {column.columnDef.header as string}
// //                   </DropdownMenuCheckboxItem>
// //                 ))}
// //             </DropdownMenuContent>
// //           </DropdownMenu>

// //           {/* Download */}
// //           <Button
// //             variant="outline"
// //             size="sm"
// //             onClick={() =>
// //               exportToCSV(table.getFilteredRowModel().rows)
// //             }
// //           >
// //             <Download size={14} />
// //           </Button>

// //           {/* Print */}
// //           <Button
// //             variant="outline"
// //             size="sm"
// //             onClick={() => window.print()}
// //           >
// //             <Printer size={14} />
// //           </Button>

// //           {/* Global Search */}
// //           <Input
// //             placeholder="Search..."
// //             value={globalFilter}
// //             onChange={(e) =>
// //               setGlobalFilter(e.target.value)
// //             }
// //             className="w-60"
// //           />
// //         </div>
// //       </div>

// //       {/* -------------------- TABLE -------------------- */}
// //       <div className="rounded-md border border-gray-300 dark:border-gray-700 overflow-x-auto">
// //         <Table className="w-full table-auto bg-white dark:bg-gray-900">
// //           <TableHeader>
// //             {table.getHeaderGroups().map((headerGroup) => (
// //               <TableRow key={headerGroup.id}>
// //                 {headerGroup.headers.map((header) => (
// //                   <TableHead
// //                     key={header.id}
// //                     style={{
// //                       width: header.getSize(),
// //                       position: "relative",
// //                     }}
// //                     className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
// //                   >
// //                     {header.isPlaceholder ? null : (
// //                       <>
// //                         <div className="flex items-center justify-between gap-2">

// //                           {/* Header + Sorting */}
// //                           <span
// //                             className="cursor-pointer select-none"
// //                             onClick={header.column.getToggleSortingHandler()}
// //                           >
// //                             {flexRender(
// //                               header.column.columnDef.header,
// //                               header.getContext(),
// //                             )}
// //                             {{
// //                               asc: " ↑",
// //                               desc: " ↓",
// //                             }[header.column.getIsSorted() as string] ?? null}
// //                           </span>

// //                           {/* Value Dropdown Filter */}
// //                           {header.column.getCanFilter() &&
// //                             header.column.id !== "actions" && (
// //                               <select
// //                                 className="text-xs border rounded px-1 py-0.5 bg-white dark:bg-gray-800"
// //                                 value={
// //                                   (header.column.getFilterValue() as string) ?? ""
// //                                 }
// //                                 onChange={(e) =>
// //                                   header.column.setFilterValue(
// //                                     e.target.value || undefined
// //                                   )
// //                                 }
// //                               >
// //                                 <option value="">All</option>
// //                                 {getUniqueValues(
// //                                   data,
// //                                   header.column.id
// //                                 ).map((val) => (
// //                                   <option key={val} value={val}>
// //                                     {String(val)}
// //                                   </option>
// //                                 ))}
// //                               </select>
// //                             )}
// //                         </div>

// //                         {/* Column Resizer */}
// //                         <div
// //                           onMouseDown={header.getResizeHandler()}
// //                           onTouchStart={header.getResizeHandler()}
// //                           className={`absolute right-0 top-0 h-full w-1 bg-gray-300 cursor-col-resize select-none touch-none hover:bg-blue-500 ${
// //                             header.column.getIsResizing()
// //                               ? "bg-blue-500"
// //                               : ""
// //                           }`}
// //                         />
// //                       </>
// //                     )}
// //                   </TableHead>
// //                 ))}
// //               </TableRow>
// //             ))}
// //           </TableHeader>

// //           <TableBody>
// //             {table.getRowModel().rows.length ? (
// //               table.getRowModel().rows.map((row, index) => (
// //                 <TableRow
// //                   key={row.id}
// //                   className={`${
// //                     index % 2 === 0
// //                       ? "bg-white dark:bg-gray-900"
// //                       : "bg-gray-100 dark:bg-gray-800"
// //                   } text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750`}
// //                 >
// //                   {row.getVisibleCells().map((cell) => (
// //                     <TableCell
// //                       key={cell.id}
// //                       style={{
// //                         width: cell.column.getSize(),
// //                       }}
// //                     >
// //                       {flexRender(
// //                         cell.column.columnDef.cell,
// //                         cell.getContext(),
// //                       )}
// //                     </TableCell>
// //                   ))}
// //                 </TableRow>
// //               ))
// //             ) : (
// //               <TableRow>
// //                 <TableCell
// //                   colSpan={columns.length}
// //                   className="text-center"
// //                 >
// //                   No results found.
// //                 </TableCell>
// //               </TableRow>
// //             )}
// //           </TableBody>

// //           <TableFooter>
// //             {table.getFooterGroups().map((footerGroup) => (
// //               <TableRow key={footerGroup.id}>
// //                 {footerGroup.headers.map((header) => (
// //                   <TableHead
// //                     key={header.id}
// //                     style={{
// //                       width: header.column.getSize(),
// //                       minWidth: header.column.getSize(),
// //                       maxWidth: header.column.getSize(),
// //                     }}
// //                     className="font-semibold whitespace-nowrap"
// //                   />
// //                 ))}
// //               </TableRow>
// //             ))}
// //           </TableFooter>
// //         </Table>
// //       </div>

// //       {/* -------------------- PAGINATION -------------------- */}
// //       <div className="flex flex-wrap items-center justify-between gap-4">
// //         <div className="flex items-center gap-2 text-sm">
// //           Rows per page:
// //           <select
// //             className="border rounded px-2 py-1"
// //             value={table.getState().pagination.pageSize}
// //             onChange={(e) =>
// //               table.setPageSize(Number(e.target.value))
// //             }
// //           >
// //             {[5, 10, 25, 50].map((size) => (
// //               <option key={size} value={size}>
// //                 {size}
// //               </option>
// //             ))}
// //           </select>
// //         </div>

// //         <div className="flex items-center gap-2">
// //           <Button
// //             variant="outline"
// //             size="sm"
// //             onClick={() => table.firstPage()}
// //             disabled={!table.getCanPreviousPage()}
// //           >
// //             {"<<"}
// //           </Button>
// //           <Button
// //             variant="outline"
// //             size="sm"
// //             onClick={() => table.previousPage()}
// //             disabled={!table.getCanPreviousPage()}
// //           >
// //             {"<"}
// //           </Button>

// //           <span className="text-sm">
// //             Page {table.getState().pagination.pageIndex + 1} of{" "}
// //             {table.getPageCount()}
// //           </span>

// //           <Button
// //             variant="outline"
// //             size="sm"
// //             onClick={() => table.nextPage()}
// //             disabled={!table.getCanNextPage()}
// //           >
// //             {">"}
// //           </Button>
// //           <Button
// //             variant="outline"
// //             size="sm"
// //             onClick={() => table.lastPage()}
// //             disabled={!table.getCanNextPage()}
// //           >
// //             {">>"}
// //           </Button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }











// "use client";

// import * as React from "react";
// import {
//   ColumnDef,
//   FilterFn,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
//   type SortingState,
//   type ColumnFiltersState,
//   type VisibilityState,
//   type ColumnResizeMode,
// } from "@tanstack/react-table";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
//   TableFooter,
// } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";

// import { Download, Filter, Printer, Columns } from "lucide-react";

// /* ------------------------------------------------------------------ */
// /* GLOBAL SEARCH FILTER                                               */
// /* ------------------------------------------------------------------ */
// const globalSearchFilter: FilterFn<any> = (row, _columnId, value) => {
//   const search = String(value).toLowerCase();
//   return Object.values(row.original).some((val) =>
//     String(val).toLowerCase().includes(search),
//   );
// };

// /* ------------------------------------------------------------------ */
// /* CSV EXPORT                                                         */
// /* ------------------------------------------------------------------ */
// function exportToCSV<T>(rows: any[], filename = "export.csv") {
//   if (!rows.length) return;

//   const headers = Object.keys(rows[0].original);
//   const csv = [
//     headers.join(","),
//     ...rows.map((row) =>
//       headers.map((key) => JSON.stringify(row.original[key] ?? "")).join(","),
//     ),
//   ].join("\n");

//   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);

//   const link = document.createElement("a");
//   link.href = url;
//   link.setAttribute("download", filename);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// }

// /* ------------------------------------------------------------------ */
// /* PROPS                                                              */
// /* ------------------------------------------------------------------ */
// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
//   initialColumnVisibility?: VisibilityState;
// }

// /* ------------------------------------------------------------------ */
// /* DATA TABLE                                                         */
// /* ------------------------------------------------------------------ */
// export function DataTable<TData, TValue>({
//   columns,
//   data,
//   initialColumnVisibility,
// }: DataTableProps<TData, TValue>) {
//   const [sorting, setSorting] = React.useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] =
//     React.useState<ColumnFiltersState>([]);
//   const [globalFilter, setGlobalFilter] = React.useState("");
//   const [columnVisibility, setColumnVisibility] =
//     React.useState<VisibilityState>(initialColumnVisibility ?? {});

//   React.useEffect(() => {
//     if (initialColumnVisibility) {
//       setColumnVisibility(initialColumnVisibility);
//     }
//   }, [initialColumnVisibility]);

//   const [columnResizeMode] =
//     React.useState<ColumnResizeMode>("onChange");

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//       columnFilters,
//       globalFilter,
//       columnVisibility,
//     },
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onGlobalFilterChange: setGlobalFilter,
//     onColumnVisibilityChange: setColumnVisibility,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     globalFilterFn: globalSearchFilter,
//     columnResizeMode,
//     enableColumnResizing: true,
//   });

//   return (
//     <div className="space-y-4">

//       {/* -------------------- TOOLBAR -------------------- */}
//       <div className="flex items-center justify-end">
//         <div className="flex items-center gap-2">

//           {/* COLUMN SHOW / HIDE */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="sm">
//                 <Columns size={14} />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="start">
//               {table
//                 .getAllLeafColumns()
//                 .filter((column) => column.getCanHide())
//                 .map((column) => (
//                   <DropdownMenuCheckboxItem
//                     key={column.id}
//                     checked={column.getIsVisible()}
//                     onCheckedChange={(value) =>
//                       column.toggleVisibility(!!value)
//                     }
//                   >
//                     {column.columnDef.header as string}
//                   </DropdownMenuCheckboxItem>
//                 ))}
//             </DropdownMenuContent>
//           </DropdownMenu>

//           {/* FILTER BUTTON */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="sm">
//                 <Filter size={14} />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent
//               align="start"
//               className="w-56"
//             >
//               <DropdownMenuLabel>
//                 Column Filters
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />

//               {table
//                 .getAllLeafColumns()
//                 .filter((column) => column.getCanFilter())
//                 .map((column) => (
//                   <div
//                     key={column.id}
//                     className="px-2 py-2 space-y-1"
//                   >
//                     <div className="text-xs font-medium">
//                       {column.columnDef.header as string}
//                     </div>
//                     <Input
//                       value={
//                         (column.getFilterValue() as string) ?? ""
//                       }
//                       onChange={(e) =>
//                         column.setFilterValue(
//                           e.target.value
//                         )
//                       }
//                       placeholder={`Filter...`}
//                       className="h-8 text-xs"
//                     />
//                   </div>
//                 ))}
//             </DropdownMenuContent>
//           </DropdownMenu>

//           {/* DOWNLOAD */}
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() =>
//               exportToCSV(table.getFilteredRowModel().rows)
//             }
//           >
//             <Download size={14} />
//           </Button>

//           {/* PRINT */}
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => window.print()}
//           >
//             <Printer size={14} />
//           </Button>

//           {/* GLOBAL SEARCH */}
//           <Input
//             placeholder="Search..."
//             value={globalFilter}
//             onChange={(e) =>
//               setGlobalFilter(e.target.value)
//             }
//             className="w-60"
//           />
//         </div>
//       </div>

//       {/* -------------------- TABLE -------------------- */}
//       <div className="rounded-md border border-gray-300 dark:border-gray-700 overflow-x-auto">
//         <Table className="w-full table-auto bg-white dark:bg-gray-900">
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableHead
//                     key={header.id}
//                     style={{
//                       width: header.getSize(),
//                       position: "relative",
//                     }}
//                     className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
//                   >
//                     {header.isPlaceholder ? null : (
//                       <>
//                         <div
//                           className="cursor-pointer select-none"
//                           onClick={header.column.getToggleSortingHandler()}
//                         >
//                           {flexRender(
//                             header.column.columnDef.header,
//                             header.getContext(),
//                           )}
//                           {{
//                             asc: " ↑",
//                             desc: " ↓",
//                           }[
//                             header.column.getIsSorted() as string
//                           ] ?? null}
//                         </div>

//                         <div
//                           onMouseDown={header.getResizeHandler()}
//                           onTouchStart={header.getResizeHandler()}
//                           className={`absolute right-0 top-0 h-full w-1 bg-gray-300 cursor-col-resize select-none touch-none hover:bg-blue-500 ${
//                             header.column.getIsResizing()
//                               ? "bg-blue-500"
//                               : ""
//                           }`}
//                         />
//                       </>
//                     )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>

//           <TableBody>
//             {table.getRowModel().rows.length ? (
//               table.getRowModel().rows.map((row, index) => (
//                 <TableRow
//                   key={row.id}
//                   className={`${
//                     index % 2 === 0
//                       ? "bg-white dark:bg-gray-900"
//                       : "bg-gray-100 dark:bg-gray-800"
//                   } text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750`}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell
//                       key={cell.id}
//                       style={{
//                         width: cell.column.getSize(),
//                       }}
//                     >
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext(),
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="text-center"
//                 >
//                   No results found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>

//           <TableFooter>
//             {table.getFooterGroups().map((footerGroup) => (
//               <TableRow key={footerGroup.id}>
//                 {footerGroup.headers.map((header) => (
//                   <TableHead
//                     key={header.id}
//                     style={{
//                       width: header.column.getSize(),
//                     }}
//                   />
//                 ))}
//               </TableRow>
//             ))}
//           </TableFooter>
//         </Table>
//       </div>

//       {/* -------------------- PAGINATION -------------------- */}
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <div className="flex items-center gap-2 text-sm">
//           Rows per page:
//           <select
//             className="border rounded px-2 py-1"
//             value={table.getState().pagination.pageSize}
//             onChange={(e) =>
//               table.setPageSize(Number(e.target.value))
//             }
//           >
//             {[5, 10, 25, 50].map((size) => (
//               <option key={size} value={size}>
//                 {size}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-center gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.firstPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             {"<<"}
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             {"<"}
//           </Button>

//           <span className="text-sm">
//             Page {table.getState().pagination.pageIndex + 1} of{" "}
//             {table.getPageCount()}
//           </span>

//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             {">"}
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.lastPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             {">>"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
















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
} from "@/components/ui/dropdown-menu";

import { Download, Filter, Printer, Columns } from "lucide-react";

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

  React.useEffect(() => {
    if (initialColumnVisibility) {
      setColumnVisibility(initialColumnVisibility);
    }
  }, [initialColumnVisibility]);

  const [columnResizeMode] =
    React.useState<ColumnResizeMode>("onChange");

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
    columnResizeMode,
    enableColumnResizing: true,
  });

  return (
    <div className="space-y-4">

      {/* -------------------- TOOLBAR -------------------- */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">

          {/* COLUMN SHOW / HIDE */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
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

          {/* FILTER BUTTON */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-56"
            >
              <DropdownMenuLabel>
                Column Filters
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {table
                .getAllLeafColumns()
                .filter((column) => column.getCanFilter())
                .map((column) => (
                  <div
                    key={column.id}
                    className="px-2 py-2 space-y-1"
                  >
                    <div className="text-xs font-medium">
                      {column.columnDef.header as string}
                    </div>
                    <Input
                      value={
                        (column.getFilterValue() as string) ?? ""
                      }
                      onChange={(e) =>
                        column.setFilterValue(
                          e.target.value
                        )
                      }
                      placeholder={`Filter...`}
                      className="h-8 text-xs"
                    />
                  </div>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* DOWNLOAD */}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              exportToCSV(table.getFilteredRowModel().rows)
            }
          >
            <Download size={14} />
          </Button>

          {/* PRINT */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
          >
            <Printer size={14} />
          </Button>

          {/* GLOBAL SEARCH */}
          <Input
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) =>
              setGlobalFilter(e.target.value)
            }
            className="w-60"
          />
        </div>
      </div>

      {/* -------------------- TABLE -------------------- */}
      <div className="rounded-md border border-gray-300 dark:border-gray-700 overflow-x-auto">
        <Table className="w-full table-auto bg-white dark:bg-gray-900">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      position: "relative",
                    }}
                    className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
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
                          }[
                            header.column.getIsSorted() as string
                          ] ?? null}
                        </div>

                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`absolute right-0 top-0 h-full w-1 bg-gray-300 cursor-col-resize select-none touch-none hover:bg-blue-500 ${
                            header.column.getIsResizing()
                              ? "bg-blue-500"
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
                      : "bg-gray-100 dark:bg-gray-800"
                  } text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750`}
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
                <TableCell
                  colSpan={columns.length}
                  className="text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.column.getSize(),
                    }}
                  />
                ))}
              </TableRow>
            ))}
          </TableFooter>
        </Table>
      </div>

      {/* -------------------- PAGINATION -------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm">
          Rows per page:
          <select
            className="border rounded px-2 py-1"
            value={table.getState().pagination.pageSize}
            onChange={(e) =>
              table.setPageSize(Number(e.target.value))
            }
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