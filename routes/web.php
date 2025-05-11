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
        $geocodes = Geocode::select(['id', 'search', 'address', 'formatted_address', 'language', 'referrer', 'created_at', 'application'])
            ->orderBy('created_at', 'desc')->limit(100)->get();
        return Inertia::render('dashboard', [
            'geocodes' => $geocodes
        ]);
    })->name('dashboard');
});

Route::prefix('api')->group(function () {
    Route::get('geocode', [ApiController::class, 'geocode'])->name('geocode');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
