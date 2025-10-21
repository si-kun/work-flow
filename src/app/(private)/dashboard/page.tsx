"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import OvertimeBarChart from "./components/OvertimeBarChart";
import OvertimePieChart from "./components/OvertimePieChart";
import {
  DepartmentOvertimeResult,
  getDepartmentOvertimeSummary,
} from "@/actions/attendance/summary/getDepartmentOvertimeSummary";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const DEPARTMENT_COLORS: { [key: string]: string } = {
  "Human Resources": "#3b82f6", // 青
  Sales: "#ef4444", // 赤
  Engineering: "#10b981", // 緑
  Finance: "#f59e0b", // オレンジ
  Marketing: "#8b5cf6", // 紫
  "General Affairs": "#06b6d4", // シアン
  Design: "#ec4899", // ピンク
  Unassigned: "#6b7280", // グレー
  Other: "#64748b", // スレートグレー
};

const DashBoard = () => {
  // 期間を指定する
  const [selectedDate, setSelectedDate] = useState(new Date());
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [departmentOvertimeData, setDepartmentOvertimeData] = useState<
    DepartmentOvertimeResult[]
  >([]);

  useEffect(() => {
    // 残業時間をサーバーから取得
    const overtimeDataFetch = async () => {
      try {
        const response = await getDepartmentOvertimeSummary(year, month);

        if (response.success) {
          const dataWithColors = response.data.map((item) => ({
            ...item,
            fill:
              DEPARTMENT_COLORS[item.department] || DEPARTMENT_COLORS["Other"],
          }));
          setDepartmentOvertimeData(dataWithColors);
        } else {
          console.error("Failed to fetch overtime data:", response.message);
        }
      } catch (error) {
        console.error("Error fetching overtime data:", error);
      }
    };
    overtimeDataFetch();
  }, [year, month]);

  const handleYearChange = (value: string) => {
    const newYear = parseInt(value);
    setSelectedDate((prev) => new Date(newYear, prev.getMonth(), 1));
  };

  const handleMonthChange = (value: string) => {
    const newMonth = parseInt(value);
    setSelectedDate((prev) => new Date(prev.getFullYear(), newMonth - 1, 1));
  };

  console.log(selectedDate);

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col p-4">
      <Tabs defaultValue="bar" className="flex flex-col overflow-hidden flex-1">
        <header className="flex gap-4 p-5">
          <TabsList>
            <TabsTrigger value="bar">棒グラフ</TabsTrigger>
            <TabsTrigger value="pie">円グラフ</TabsTrigger>
          </TabsList>

          {/* 年月選択 */}
          {/* 年 */}
          <div className="flex gap-2">
            <Select onValueChange={handleYearChange} value={year.toString()}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={`${year}年`} />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }).map((_, index) => {
                  const displayYear = currentYear - index;
                  return (
                    <SelectItem key={index} value={String(displayYear)}>
                      {displayYear}年
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {/* 月 */}
            <Select onValueChange={handleMonthChange} value={month.toString()}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={`${month}月`} />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }).map((_, index) => (
                  <SelectItem key={index} value={String(index + 1)}>
                    {index + 1}月
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        <TabsContent value="bar" className="flex-1 overflow-y-auto">
          <OvertimeBarChart
            data={departmentOvertimeData}
            year={year}
            month={month}
          />
        </TabsContent>

        <TabsContent value="pie" className="flex-1 overflow-y-auto">
          <OvertimePieChart
            data={departmentOvertimeData}
            year={year}
            month={month}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashBoard;
