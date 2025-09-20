import { ComponentProps } from 'react';

import { Head, router } from '@inertiajs/react';

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UsageChart } from '@/components/usage-chart';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import clsx from 'clsx';
import { GlobeIcon, TrashIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type Geocode = {
    application: string;
    created_at_diff: string;
    domain: string;
    formatted_address: string | null;
    id: number;
    language: string;
    referrer: string;
    search: string;
    bounds: boolean;
};

type Application = {
    application: string;
    total: number;
};

type Domain = {
    domain: string;
    label: string;
    total: number;
};

export default function Dashboard({
    applications,
    chart_data,
    domains,
    geocodes,
}: {
    applications: Application[];
    domains: Domain[];
    geocodes: Geocode[];
} & ComponentProps<typeof UsageChart>) {
    function deleteGeocode(id: number) {
        router.post(`/geocodes/delete/${id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative grid grid-rows-[min-content] overflow-hidden rounded-xl border">
                        <TableCaption>Total requests by month</TableCaption>
                        <UsageChart chart_data={chart_data} />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                        <Table>
                            <TableCaption>Monthly requests by application</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Application</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applications.map(({ application, total }) => (
                                    <TableRow key={application}>
                                        <TableCell>{application}</TableCell>
                                        <TableCell className="text-right">{total.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                        <Table>
                            <TableCaption>Monthly requests by domain</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Domain</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {domains.map(({ domain, label, total }) => (
                                    <TableRow key={domain}>
                                        <TableCell>
                                            <a className="cursor-pointer hover:underline" href={`https://${domain}/`} target="_blank">
                                                {label}
                                            </a>
                                        </TableCell>
                                        <TableCell className="text-right">{total.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <Table>
                        <TableCaption>Last 100 geocodes</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="flex items-center justify-center">
                                    <GlobeIcon strokeWidth={1} width={20} />
                                </TableHead>
                                <TableHead>Referrer</TableHead>
                                <TableHead>Search</TableHead>
                                <TableHead>Formatted Address</TableHead>
                                <TableHead className="text-right">Created At</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {geocodes.map((geocode) => (
                                <TableRow key={geocode.id}>
                                    <TableCell
                                        className={clsx('text-center font-mono text-xs uppercase', {
                                            'text-neutral-400 dark:text-neutral-400': geocode.language === 'en',
                                            'font-bold': geocode.language !== 'en',
                                        })}
                                    >
                                        {geocode.language}
                                    </TableCell>
                                    <TableCell className="max-w-[350px] items-center truncate">
                                        <span
                                            className={clsx('mr-2 rounded px-2 py-1 font-mono text-xs font-bold text-white uppercase', {
                                                'bg-indigo-600': geocode.application === 'tsml-ui',
                                                'bg-neutral-600': geocode.application === 'geo',
                                                'bg-rose-600': geocode.application === 'tsml',
                                            })}
                                        >
                                            <span className="max-w-full truncate">{geocode.application}</span>
                                        </span>
                                        <a className="cursor-pointer hover:underline" href={geocode.referrer} target="_blank">
                                            {geocode.domain}
                                        </a>
                                    </TableCell>
                                    <TableCell className="whitespace-normal">{geocode.search}</TableCell>
                                    <TableCell className="whitespace-normal">{geocode.formatted_address}</TableCell>
                                    <TableCell className="text-right">{geocode.created_at_diff}</TableCell>
                                    <TableCell className="flex items-center justify-center">
                                        <button
                                            onClick={() => deleteGeocode(geocode.id)}
                                            className="cursor-pointer rounded p-2 hover:bg-white dark:hover:bg-black"
                                        >
                                            <TrashIcon strokeWidth={1} size={20} />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
