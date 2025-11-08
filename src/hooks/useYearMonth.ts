"use client";

import { YearMonthData } from "@/types/attendance";
import { useState } from "react";

export const useYearMonth = ():YearMonthData => {
      // 期間フィルター
  const [selectedDate, setSelectedDate] = useState(new Date());
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  const handleYearChange = (year: string) => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(parseInt(year));
      return newDate;
    });
  };
  const handleMonthChange = (month: string) => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(parseInt(month) - 1);
      return newDate;
    });
  };

    return {year,month,handleYearChange,handleMonthChange};
}
