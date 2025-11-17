import { Skeleton } from "../ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  gridTemplateColumns: string; // ← 追加
}

const TableSkeleton = ({ rows = 5, gridTemplateColumns }: TableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid items-center border-b border-slate-300"
          style={{ gridTemplateColumns }} // ← 追加
        >
          {gridTemplateColumns.split(" ").map((_, colIndex) => (
            <div
              key={colIndex}
              className="px-3 py-3 border-r border-slate-300 last:border-r-0"
            >
              <Skeleton className="h-5 w-full" />
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default TableSkeleton;