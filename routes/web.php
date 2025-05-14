<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ApiController;
use App\Models\Geocode;
use Carbon\Carbon;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $geocodes = Geocode::select(['id', 'search', 'formatted_address', 'language', 'domain', 'referrer', 'created_at', 'application'])
            ->orderBy('created_at', 'desc')->limit(100)->get()->map(function ($geocode) {
                $geocode->created_at_diff = Carbon::parse($geocode->created_at)->diffForHumans();
                return $geocode;
            });
        $domains = Geocode::select('domain', DB::raw('count(*) as total'))->groupBy('domain')->get();
        $dates = Geocode::select(['created_at'])->where('created_at', '>', Carbon::now()->startOfMonth()->subMonths(5))
            ->get()->map(function ($item) {
                return $item->created_at->format('M');
            })->toArray();
        $chart_data = array_map(function ($diff) use ($dates) {
            $month = Carbon::now()->startOfMonth()->subMonths($diff)->format('F');
            $geocodes = count(array_filter($dates, function ($date) use ($month) {
                return $date === $month;
            }));
            return compact('month', 'geocodes');
        }, [5, 4, 3, 2, 1, 0]);
        return Inertia::render('dashboard', [
            'geocodes' => $geocodes,
            'domains' => $domains,
            'chart_data' => $chart_data
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
