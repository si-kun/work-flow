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

interface OvertimeData {
  department: string;
  overtime: number;
}

interface OvertimeBarChartProps {
  data: OvertimeData[];
}

const chartConfig = {
  overtime: {
    label: "残業時間",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function OvertimeBarChart({ data }: OvertimeBarChartProps) {
  return (
    <Card  className="h-[80%]">
      <CardHeader>
        <CardTitle>部署別平均残業時間</CardTitle>
        <CardDescription>今月の部署ごとの平均残業時間</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[80%]">
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
            <Bar dataKey="overtime" fill="var(--color-overtime)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}