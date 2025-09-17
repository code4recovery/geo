import { ComponentProps, useEffect, useRef, useState } from 'react';

import { Head, Link, usePage } from '@inertiajs/react';
import clsx from 'clsx';
import { divIcon, type Map, Point } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SquareArrowOutUpRightIcon } from 'lucide-react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';

import { useDarkMode } from '@/hooks/use-dark-mode';
import { type SharedData } from '@/types';

const buttonClass = 'rounded border hover:border-neutral-400 dark:border-neutral-700 px-4 py-2 dark:hover:border-neutral-500';

export default function Welcome({ mapbox }: { mapbox: string }) {
    const isDarkMode = useDarkMode();

    const mapRef = useRef<Map>(null);

    const { auth } = usePage<SharedData>().props;
    const [location, setLocation] = useState<ComponentProps<typeof Location>>();

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        const [west, south, east, north] = mapRef.current?.getBounds().toBBoxString().split(',') || [];

        const response = await fetch(
            `/api/geocode?${new URLSearchParams({
                search: `${data.get('search')}`,
                application: 'geo',
                referrer: window.location.href,
                north,
                south,
                east,
                west,
            })}`,
        );
        const { results } = await response.json();
        if (results.length) {
            setLocation({
                formatted_address: results[0].formatted_address,
                location: results[0].geometry.location,
            });
        } else {
            // todo handle error with toast
        }
    };

    return (
        <>
            <Head title="Geo" />
            <div className="flex min-h-dvh flex-col md:flex-row-reverse">
                <div className="flex flex-col justify-items-start gap-6 p-5 md:w-1/4 md:shadow-2xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link href={route('dashboard')} className={clsx('inline-block', buttonClass)}>
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className={clsx('inline-block', buttonClass)}>
                                    Log in
                                </Link>
                                <Link href={route('register')} className={clsx('inline-block', buttonClass)}>
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
                    <p>You can search for an address and get its coordinates.</p>
                    <form onSubmit={handleSearch}>
                        <input
                            type="search"
                            name="search"
                            className="w-full rounded border bg-neutral-200 px-4 py-2 dark:bg-neutral-800 [&::-webkit-search-cancel-button]:hidden"
                            placeholder="Search for an address"
                        />
                    </form>
                    {location && (
                        <a
                            className={clsx('flex gap-4', buttonClass)}
                            target="_blank"
                            href={`https://maps.google.com/?q=${Object.values(location.location).join()}`}
                        >
                            <SquareArrowOutUpRightIcon className="mt-1 size-5" />
                            <div className="flex flex-col gap-2">
                                <h1 className="font-bold">{location.formatted_address}</h1>
                                <code className="font-mono text-sm">{Object.values(location.location).join(', ')}</code>
                            </div>
                        </a>
                    )}
                </div>
                <div className="relative flex-grow md:w-3/4">
                    <MapContainer
                        center={[0, 0]}
                        minZoom={2}
                        ref={mapRef}
                        style={{ bottom: 0, position: 'absolute', top: 0, width: '100%' }}
                        zoom={2}
                    >
                        <TileLayer
                            attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
                            tileSize={512}
                            url={`https://api.mapbox.com/styles/v1/mapbox/${isDarkMode ? 'dark' : 'streets'}-v11/tiles/{z}/{x}/{y}?access_token=${mapbox}`}
                            zoomOffset={-1}
                        />
                        {location && <Location {...location} />}
                    </MapContainer>
                </div>
            </div>
        </>
    );
}

const Location = ({
    formatted_address,
    location,
}: {
    formatted_address: string;
    location: {
        lat: number;
        lng: number;
    };
}) => {
    const map = useMap();
    useEffect(() => {
        map.setView(location, 16);
    }, [formatted_address, map, location]);
    return (
        <Marker
            position={location}
            icon={divIcon({
                className: 'tsml-ui-marker',
                html: `<svg viewBox="-1.1 -1.086 43.182 63.273" xmlns="http://www.w3.org/2000/svg"><path fill="#f76458" stroke="#b3382c" stroke-width="3" d="M20.5,0.5 c11.046,0,20,8.656,20,19.333c0,10.677-12.059,21.939-20,38.667c-5.619-14.433-20-27.989-20-38.667C0.5,9.156,9.454,0.5,20.5,0.5z"/></svg>`,
                iconAnchor: [13, 19.2],
                iconSize: new Point(26, 38.4),
            })}
        />
    );
};
