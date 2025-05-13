import { Head } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Search',
        href: '/search',
    },
];

export default function Search() {
    const [geocode, setGeocode] = useState('');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Search" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <form
                    method="post"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const search = formData.get('search')?.toString();
                        if (!search) {
                            return;
                        }
                        const result = await fetch(
                            `/api/geocode?${new URLSearchParams({
                                search,
                                referrer: window.location.href,
                                application: 'geo',
                            })}`,
                        );

                        const response = await result.json();

                        setGeocode(JSON.stringify(response, null, 2));
                    }}
                >
                    <input
                        className="w-full rounded-lg border bg-neutral-900 px-3 py-1 text-lg"
                        placeholder="Enter address"
                        type="search"
                        name="search"
                    />
                </form>
                <pre className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    {geocode}
                </pre>
            </div>
        </AppLayout>
    );
}
