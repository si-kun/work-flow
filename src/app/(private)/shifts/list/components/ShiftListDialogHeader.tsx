import React from "react";
import SelectYearMonth from "@/components/common/SelectYearMonth";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ShiftDialogHeaderProps {
  year: number;
  month: number;
  handleYearChange: (year: string) => void;
  handleMonthChange: (month: string) => void;
  userName?: string;
}

const ShiftListDialogHeader = ({
  year,
  month,
  handleYearChange,
  handleMonthChange,
  userName,
}: ShiftDialogHeaderProps) => {
  return (
    <DialogHeader className="flex flex-col gap-2">
      <DialogTitle>シフト確認 - {userName}さん</DialogTitle>
      <DialogDescription>{userName}さんのシフト表です</DialogDescription>
      <div className="flex items-center">
        <SelectYearMonth
          year={year}
          month={month}
          handleYearChange={handleYearChange}
          handleMonthChange={handleMonthChange}
        />
      </div>
    </DialogHeader>
  );
};

export default ShiftListDialogHeader;
