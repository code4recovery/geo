'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
    geocodes: {
        label: 'geocodes',
        color: '#0368b0',
    },
} satisfies ChartConfig;

type ChartData = {
    month: string;
    count: number;
};

export const UsageChart = ({ chart_data }: { chart_data: ChartData[] }) => (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chart_data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
            <ChartTooltip content={<ChartTooltipContent className="min-w-[150px]" />} />
            <Bar dataKey="geocodes" fill="var(--color-geocodes)" radius={4} isAnimationActive={false} />
        </BarChart>
    </ChartContainer>
);
