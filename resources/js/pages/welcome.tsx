import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        console.log(data.get('search'));
    };

    return (
        <>
            <Head title="Geo" />
            <div className="flex min-h-dvh flex-col md:flex-row-reverse">
                <div className="flex w-1/4 flex-col justify-items-start gap-6 p-4">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="inline-block rounded border px-4 py-2 hover:border-neutral-500">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="inline-block rounded border px-4 py-2 hover:border-neutral-500">
                                    Log in
                                </Link>
                                <Link href={route('register')} className="inline-block rounded border px-4 py-2 hover:border-neutral-500">
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                    <p>
                        <a href="https://github.com/code4recovery/geo" className="underline" target="_blank">
                            Geo
                        </a>{' '}
                        is a new geocoding service from{' '}
                        <a href="https://code4recovery.org" className="underline" target="_blank">
                            Code for Recovery
                        </a>
                        . Soon you will be able to use it to override addresses in{' '}
                        <a href="https://wordpress.org/plugins/12-step-meeting-list/" className="underline" target="_blank">
                            12 Step Meeting List
                        </a>
                        .
                    </p>
                    <p>You will also be able to search for an address and get its coordinates.</p>
                    <form onSubmit={handleSearch}>
                        <input
                            type="search"
                            name="search"
                            className="w-full rounded border bg-neutral-800 px-4 py-2"
                            placeholder="Search for an address"
                        />
                    </form>
                </div>
                <div className="w-3/4 bg-cyan-500 dark:bg-cyan-800">
                    <MapContainer center={[0, 0]} zoom={2} style={{ height: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}s.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />
                    </MapContainer>
                </div>
            </div>
        </>
    );
}
