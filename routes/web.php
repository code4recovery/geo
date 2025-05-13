<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ApiController;
use App\Models\Geocode;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $geocodes = Geocode::select(['id', 'search', 'formatted_address', 'language', 'domain', 'referrer', 'created_at', 'application'])
            ->orderBy('created_at', 'desc')->limit(100)->get();
        $domains = Geocode::select('domain', DB::raw('count(*) as total'))->groupBy('domain')->get();
        return Inertia::render('dashboard', [
            'geocodes' => $geocodes,
            'domains' => $domains
        ]);
    })->name('dashboard');

    Route::get('search', function () {
        return Inertia::render('search');
    });
});

Route::prefix('api')->group(function () {
    Route::get('geocode', [ApiController::class, 'geocode'])->name('geocode');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
