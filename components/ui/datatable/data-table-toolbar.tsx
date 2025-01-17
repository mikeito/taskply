import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/custom/button";
import { Input } from "@/components/ui/input";
import { ReactNode } from "react";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchColumn?: string;
  searchPlaceholder?: string;
  filterColumns?: Array<{ [key: string]: any }>;
  createBtn?: ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  searchColumn,
  searchPlaceholder,
  filterColumns,
  createBtn,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        {searchColumn && searchPlaceholder && (
          <Input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchColumn)?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {filterColumns && (
          <div className="flex gap-x-2">
            {filterColumns.map((item, i) =>
              Object.entries(item).map(([key, value]) => (
                <DataTableFacetedFilter
                  key={`${key}-${i}`} // Unique key combining key and index
                  column={table.getColumn(key)}
                  title={key}
                  options={value}
                />
              ))
            )}
            {/* {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={statuses}
            />
          )}
          {table.getColumn("priority") && (
            <DataTableFacetedFilter
              column={table.getColumn("priority")}
              title="Priority"
              options={priorities}
            />
          )} */}
          </div>
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {createBtn && createBtn}
      <DataTableViewOptions table={table} />
    </div>
  );
}
