import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

const TableSkeleton = ({ rows = 5, columns = 5 }: TableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <li key={rowIndex} className="contents">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="p-2 border-b border-r border-slate-300"
            >
              <Skeleton className="h-5 w-full" />
            </div>
          ))}
        </li>
      ))}
    </>
  );
};

export default TableSkeleton;
