"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"


interface SchoolBarChartProps {
  data: { name: string; value: number }[];
}

const chartConfig = {
    name: {
      label: "学校",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

export function SchoolBarChart({ data }: SchoolBarChartProps) {
  // 按数值排序
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <Card className="bg-stone-950">
      <CardContent className="pt-6">
        <ChartContainer config={chartConfig}>
          <BarChart
            data={sortedData}
            layout="horizontal"
            margin={{
              left: -20,  // 增加左边距以显示完整学校名
              right: 20,
              top: 10,
              bottom: 0
            }}
          >
            <YAxis type="number" dataKey="value" />
            <XAxis
              dataKey="name"
              type="category"
              tickLine={true}
              axisLine={true}
              width={110}  // 增加宽度以显示完整学校名
              // 移除 tickFormatter 以显示完整名称
            />
            <ChartTooltip
              cursor={{ fill: 'rgba(255,255,255,0.1)' }}
              content={({ payload }) => {
                if (!payload?.length) return null;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium">{payload[0].payload.name}</span>
                      <span className="font-medium">{payload[0].payload.value}人</span>
                    </div>
                  </div>
                );
              }}
            />
            <Bar 
              dataKey="value"  // 修改为 value
              fill="hsl(var(--primary))"
              radius={5} 
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
} 



