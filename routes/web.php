<?php

use App\Http\Controllers\Apps\DashboardController;
use App\Http\Controllers\Apps\PermissionController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (Auth::check())
        return to_route('apps.dashboard');

    return inertia('auth/login');
});

Route::group(['prefix' => 'apps', 'as' => 'apps.', 'middleware' => ['auth']], function () {
    // dashboard route
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
    // permission route
    Route::resource('permissions', PermissionController::class)->except(['create', 'edit', 'show']);
});


require __DIR__ . '/auth.php';
