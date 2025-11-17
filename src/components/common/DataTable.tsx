"use client";

import { TableHeader } from "@/constants/employee";
import React from "react";
import TableSkeleton from "../loading/TableSkeleton";

interface Row {
  id: string;
  data: React.ReactNode[];
  isSelected?: boolean;
}

interface DataTableProps {
  headers: TableHeader[];
  rows: Row[];
  onRowClick?: (id: string) => void;
  renderLastCell?: (rowId: string) => React.ReactNode;
  loading?: boolean;
}

const DataTable = ({
  headers,
  rows,
  onRowClick,
  renderLastCell,
  loading = false,
}: DataTableProps) => {
  const gridTemplateColumns = headers.map((header) => header.width).join(" ");

  return (
    <div className="flex-1 w-full">
      <div
        className="bg-slate-50 border border-slate-300 grid sticky top-0 z-10"
        style={{ gridTemplateColumns }}
      >
        {headers.map((header) => (
          <span
            key={header.id}
            className={`px-3 py-2.5 text-slate-900 border-r border-slate-300 last:border-0 font-medium`}
          >
            {header.label}
          </span>
        ))}
      </div>

      <div className="flex-1 border border-t-0">
        {loading ? (
          <TableSkeleton gridTemplateColumns={gridTemplateColumns} />
        ) : (
          rows.map((row) => (
            <div
              className={`grid items-center border-b border-slate-300 hover:bg-slate-100 hover:cursor-pointer last:border-b-0 ${
                row.isSelected ? "bg-amber-200" : ""
              }`}
              style={{ gridTemplateColumns }}
              key={row.id}
              onClick={() => onRowClick?.(row.id)}
            >
              {row.data.map((cellData, index) => {
                return (
                  <div
                    key={index}
                    className={`flex items-center px-3 py-3 text-slate-900 border-r border-slate-300 last:border-r-0
                    `}
                  >
                    {cellData}
                  </div>
                );
              })}

              {renderLastCell && (
                <div className="flex items-center border-r border-slate-300 last:border-r-0">
                  {renderLastCell(row.id)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DataTable;
