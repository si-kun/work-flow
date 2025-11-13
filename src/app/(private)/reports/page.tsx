"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import SelectYearMonth from "@/components/common/SelectYearMonth";
import { useEffect, useState } from "react";
import { getAttendanceReport } from "@/actions/attendance/summary/getAttendanceReport";
import { useYearMonth } from "@/hooks/useYearMonth";
import { Attendance } from "@prisma/client";

type YearAttendanceData = Record<string, Attendance[]>;

const ReportsPage = () => {
  const { year, month, handleYearChange } = useYearMonth();

  const [attendanceData, setAttendanceData] = useState<YearAttendanceData>({});

  const [chartData, setChartData] = useState<
    Array<{ month: string; overtimeHours: number }>
  >([]);

  useEffect(() => {
    // 1月から12月までループ
    const attendanceChartData = Array.from({ length: 12 }, (_, index) => {
      const monthIndex = index + 1;
      const monthKey = `${year}-${monthIndex.toString().padStart(2, "0")}`;

      const monthData = attendanceData[monthKey] || [];

      // 月ごとの残業時間の合計
      const overtimeMinutes = monthData.reduce(
        (sum, attendance) => sum + (attendance.overtimeMinutes || 0),
        0
      );

      const overtimeHours = Math.round(overtimeMinutes / 60 * 10) / 10;

      // 月ごとに日勤、夜勤、有給、欠勤をそれぞれカウント
      const dayWorking = monthData.filter(
        (d) => d.workType === "day_working"
      ).length;
      const nightWorking = monthData.filter(
        (n) => n.workType === "night_working"
      ).length;
      const paid = monthData.filter((p) => p.workType === "paid").length;
      const absent = monthData.filter(
        (a) => a.workType === "absenteeism"
      ).length;

      return {
        month: monthKey,
        dayWorking,
        nightWorking,
        paid,
        absent,
        overtimeHours,
      };
    });
    setChartData(attendanceChartData);
    console.log("chartData", attendanceChartData); // 更新された値を直接ログ出力
  }, [attendanceData, year]);

  const chartConfig = {
    dayWorking: {
      label: "日勤",
      color: "#5cfa34",
    },
    nightWorking: {
      label: "夜勤",
      color: "#7c3aed",
    },
    paid: {
      label: "有給",
      color: "#92f323",
    },
    absent: {
      label: "欠勤",
      color: "#fc0d35",
    },
    overtimeHours: {
      label: "残業時間",
      color: "#a4a2c2",
    },
  };

  const workingChartConfig = [
    { key: "dayWorking", label: "日勤" },
    { key: "nightWorking", label: "夜勤" },
    { key: "paid", label: "有給" },
    { key: "absent", label: "欠勤" },
  ]

  // attendanceからデータを取得する
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAttendanceReport(
          "dummy-user-1",
          new Date(year, 0, 1),
          new Date(year, 11, 31)
        );

        if (result.success) {
          const groupedData = result.data.reduce<YearAttendanceData>(
            (acc, attendance) => {
              const monthKey = new Date(attendance.date)
                .toISOString()
                .slice(0, 7);
              if (!acc[monthKey]) {
                acc[monthKey] = [];
              }
              acc[monthKey].push(attendance);
              return acc;
            },
            {}
          );
          setAttendanceData(groupedData);
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };
    fetchData();
  }, [year, month]);

  console.log("attendanceData", attendanceData);

  return (
    <div className="flex flex-col overflow-hidden h-full gap-4">
      <div className="flex items-center gap-2">
        <SelectYearMonth
          year={year}
          month={month}
          handleYearChange={handleYearChange}
          handleMonthChange={() => {}}
        />
      </div>

      {Object.keys(attendanceData).length === 0 ? (
        <div>データがありません</div>
      ) : (
        <ChartContainer
          config={chartConfig}
          className="w-full flex-1 overflow-y-auto"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(5) + "月"}
            />
            <ChartTooltip content={<ChartTooltipContent />}  />
            {/* 残業時間(時間単位) */}
            <Bar
              dataKey="overtimeHours"
              fill="var(--color-overtimeHours)"
              radius={4}
              name="残業時間"
            />

            {/* 出勤日数(積み上げ) */}
            {workingChartConfig.map((config) => (

            <Bar key={config.key}
              stackId="attendance"
              dataKey={config.key}
              fill={`var(--color-${config.key})`}
              radius={4}
              name={config.label}
            />
            ))}
            {/* <Bar
              stackId="attendance"
              dataKey="nightWorking"
              fill="var(--color-nightWorking)"
              radius={4}
              name="夜勤"
            />
            <Bar
              stackId="attendance"
              dataKey="paid"
              fill="var(--color-paid)"
              radius={4}
              name="有給"
            />
            <Bar
              stackId="attendance"
              dataKey="absent"
              fill="var(--color-absent)"
              radius={4}
              name="欠勤"
            /> */}
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
};

export default ReportsPage;
