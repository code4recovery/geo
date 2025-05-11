import { Head } from '@inertiajs/react';

import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type Geocode = {
    application: string;
    created_at: string;
    formatted_address: string | null;
    id: number;
    language: string;
    referrer: string | null;
    search: string;
};

export default function Dashboard({ geocodes }: { geocodes: Geocode[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <Table>
                        <TableCaption>A list of recent geocodes.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Referrer</TableHead>
                                <TableHead>Language</TableHead>
                                <TableHead>Search</TableHead>
                                <TableHead>Formatted Address</TableHead>
                                <TableHead className="text-right">Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {geocodes.map((geocode) => (
                                <TableRow key={geocode.id}>
                                    <TableCell>
                                        <span className="mr-2 rounded bg-indigo-500 px-2">{geocode.application}</span>
                                        {geocode.referrer && (
                                            <a className="hover:underline" href={geocode.referrer} target="_blank">
                                                {geocode.referrer}
                                            </a>
                                        )}
                                    </TableCell>
                                    <TableCell>{geocode.language}</TableCell>
                                    <TableCell>{geocode.search}</TableCell>
                                    <TableCell>{geocode.formatted_address}</TableCell>
                                    <TableCell className="text-right">{geocode.created_at}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
