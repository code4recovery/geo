<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ApiController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::prefix('api')->group(function () {
    Route::get('geocode', [ApiController::class, 'geocode'])->name('geocode');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
