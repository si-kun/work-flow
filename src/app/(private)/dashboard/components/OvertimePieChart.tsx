"use client";

import { Pie, PieChart } from "recharts";
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
import { minutesToTime } from "@/utils/timeUtils";

interface OvertimeData {
  department: string;
  overtime: number;
}

interface OvertimePieChartProps {
  data: OvertimeData[];
}

const chartConfig = {
  overtime: {
    label: "残業時間",
  },
} satisfies ChartConfig;

export default function OvertimePieChart({ data }: OvertimePieChartProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>部署別平均残業時間</CardTitle>
        <CardDescription>今月の部署ごとの平均残業時間(円グラフ)</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ChartContainer config={chartConfig} className="h-[600px] w-[600px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={data}
              dataKey="overtime"
              nameKey="department"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="var(--color-overtime)"
              label={({department,overtime}) => `${convertToJapanese(department,DEPARTMENTS)} ${minutesToTime(overtime)}`}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}