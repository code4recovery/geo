'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
    { month: 'January', requests: 186, geocodes: 80 },
    { month: 'February', requests: 305, geocodes: 200 },
    { month: 'March', requests: 237, geocodes: 120 },
    { month: 'April', requests: 73, geocodes: 190 },
    { month: 'May', requests: 209, geocodes: 130 },
    { month: 'June', requests: 214, geocodes: 140 },
];

const chartConfig = {
    requests: {
        label: 'requests',
        color: '#2563eb',
    },
    geocodes: {
        label: 'geocodes',
        color: '#60a5fa',
    },
} satisfies ChartConfig;

export const UsageChart = () => (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="requests" fill="var(--color-requests)" radius={4} isAnimationActive={false} />
            <Bar dataKey="geocodes" fill="var(--color-geocodes)" radius={4} isAnimationActive={false} />
        </BarChart>
    </ChartContainer>
);
