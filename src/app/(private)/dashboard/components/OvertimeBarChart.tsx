"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { convertToJapanese } from "@/lib/convertToJapanese";
import { DEPARTMENTS } from "@/constants/employee";
import { useState } from "react";
import DepartmentDetailModal from "./DepartmentDetailModal";
import { useAttendanceData } from "@/hooks/useAttendanceData";

interface OvertimeData {
  department: string;
  overtime: number;
}

interface OvertimeBarChartProps {
  data: OvertimeData[];
  year: number;
  month: number;
}

const chartConfig = {
  overtime: {
    label: "残業時間",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;


export default function OvertimeBarChart({ data,year,month }: OvertimeBarChartProps) {

  const [targetDepartment, setTargetDepartment] = useState<string | null>(null);
  const [barClickOpen, setBarClickOpen] = useState(false);

  const handleDepartmentClick = (department: string) => {
    setTargetDepartment(department);
    setBarClickOpen(true);
  }

  const {attendanceData} = useAttendanceData({year, month})

  console.log(attendanceData)
  console.log(targetDepartment)

  const filteredUser = attendanceData.filter((user) => user.department === targetDepartment)
  console.log("filteredUser", filteredUser)


  return (
    <Card  className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>部署別平均残業時間</CardTitle>
        <CardDescription>今月の部署ごとの平均残業時間</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="department"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => convertToJapanese(value, DEPARTMENTS)}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="overtime" fill="var(--color-overtime)" radius={8} onClick={(data) => handleDepartmentClick(data.department)} />
          </BarChart>
        </ChartContainer>

        {/* 対象の従業員一覧のモーダルを開く */}
        <DepartmentDetailModal isOpen={barClickOpen} setIsOpen={setBarClickOpen} user={filteredUser} />
      </CardContent>
    </Card>
  );
}