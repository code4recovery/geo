<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ApiController;
use App\Models\Geocode;
use Carbon\Carbon;

Route::get('/', function () {
    return Inertia::render('welcome', ['mapbox' => env('MAPBOX_ACCESS_TOKEN')]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $geocodes = Geocode::select([
            'id',
            'search',
            'formatted_address',
            'language',
            'domain',
            'referrer',
            'created_at',
            'application',
            'north',
            'south',
            'east',
            'west',
        ])
            ->orderBy('created_at', 'desc')->limit(100)->get()->map(function ($geocode) {
                $geocode->created_at_diff = Carbon::parse($geocode->created_at)->diffForHumans();
                $geocode->bounds = $geocode->north && $geocode->south && $geocode->east && $geocode->west;
                return $geocode;
            });

        $decoded_domains = [
            'meetingfinderstorage.z13.web.core.windows.net' => 'CA Meeting Finder App',
        ];

        $domains = Geocode::select('domain', DB::raw('count(*) as total'))
            ->where('created_at', '>', Carbon::now()->startOfMonth()->subMonths(1))
            ->groupBy('domain')
            ->orderBy('total', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($item) use ($decoded_domains) {
                $item->label = $decoded_domains[$item->domain] ?? $item->domain;
                return $item;
            });
        $applications = Geocode::select('application', DB::raw('count(*) as total'))
            ->where('created_at', '>', Carbon::now()->startOfMonth()->subMonths(1))
            ->groupBy('application')
            ->orderBy('total', 'desc')
            ->limit(10)
            ->get();
        $dates = Geocode::select(['created_at'])
            ->where('created_at', '>', Carbon::now()->startOfMonth()->subMonths(5))
            ->get()
            ->map(function ($item) {
                return $item->created_at->format('M');
            })
            ->toArray();
        $chart_data = array_map(function ($diff) use ($dates) {
            $month = Carbon::now()->startOfMonth()->subMonths($diff)->format('M');
            $geocodes = count(array_filter($dates, function ($date) use ($month) {
                return $date === $month;
            }));
            return compact('month', 'geocodes');
        }, [5, 4, 3, 2, 1, 0]);
        return Inertia::render('dashboard', [
            'applications' => $applications,
            'chart_data' => $chart_data,
            'domains' => $domains,
            'geocodes' => $geocodes,
        ]);
    })->name('dashboard');

    Route::get('search', function () {
        return Inertia::render('search');
    });

    Route::post('/geocodes/delete/{id}', function ($id) {
        Geocode::find($id)->delete();
    });
});

Route::prefix('api')->group(function () {
    Route::get('geocode', [ApiController::class, 'geocode'])->name('geocode');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
