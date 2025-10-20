"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import OvertimeBarChart from "./components/OvertimeBarChart";
import OvertimePieChart from "./components/OvertimePieChart";
import {
  DepartmentOvertimeResult,
  getDepartmentOvertimeSummary,
} from "@/actions/attendance/summary/getDepartmentOvertimeSummary";

export const DEPARTMENT_COLORS: { [key: string]: string } = {
  "Human Resources": "#3b82f6", // 青
  "Sales": "#ef4444", // 赤
  "Engineering": "#10b981", // 緑
  "Finance": "#f59e0b", // オレンジ
  "Marketing": "#8b5cf6", // 紫
  "General Affairs": "#06b6d4", // シアン
  "Design": "#ec4899", // ピンク
  "Unassigned": "#6b7280", // グレー
  "Other": "#64748b", // スレートグレー
};

const DashBoard = () => {
  // 期間を指定する
  const [selectedDate, setSelectedDate] = useState(new Date());
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

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
            fill: DEPARTMENT_COLORS[item.department] || DEPARTMENT_COLORS["Other"],
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

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col p-4">
      <header className="flex items-center gap-4 p-5">
        {/* <h1 className="text-lg font-bold">ダッシュボード</h1> */}
        <Tabs defaultValue="bar" className="flex flex-1 flex-col h-full">
          <TabsList>
            <TabsTrigger value="bar">棒グラフ</TabsTrigger>
            <TabsTrigger value="pie">円グラフ</TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="flex-1">
            <OvertimeBarChart data={departmentOvertimeData} />
          </TabsContent>

          <TabsContent value="pie">
            <OvertimePieChart data={departmentOvertimeData} />
          </TabsContent>
        </Tabs>
      </header>
    </div>
  );
};

export default DashBoard;
