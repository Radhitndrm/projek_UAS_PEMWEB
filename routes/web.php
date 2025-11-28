<?php

use App\Http\Controllers\Apps\CategoryController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Apps\RoleController;
use App\Http\Controllers\Apps\UnitController;
use App\Http\Controllers\Apps\UserController;
use App\Http\Controllers\Apps\DashboardController;
use App\Http\Controllers\Apps\PermissionController;
use App\Http\Controllers\Apps\SupplierController;
use App\Http\Controllers\Apps\ProductController;
use App\Http\Controllers\Apps\ProductUnitController;

Route::get('/', function () {
    if (Auth::check())
        return to_route('apps.dashboard');

    return inertia('auth/login');
});

Route::group(['prefix' => 'apps', 'as' => 'apps.', 'middleware' => ['auth']], function () {
    // dashboard route
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    // unit route
    Route::resource('units', UnitController::class)->except(['show']);
    // category route
    Route::resource('categories', CategoryController::class)->except(['show']);
    // supplier route
    Route::get('/suppliers/{supplier}/get-orders', [SupplierController::class, 'getOrders'])->name('suppliers.get-orders');
    Route::resource('suppliers', SupplierController::class)->except(['show']); // product unit route
    Route::controller(ProductUnitController::class)->name('product-units.')->group(function () {
        Route::get('/products/{product}/product-units', 'create')->name('create');
        Route::post('/products/{product}/product-units', 'store')->name('store');
        Route::get('/products/{product}/product-units/{productUnit}/edit', 'edit')->name('edit');
        Route::put('/products/{product}/product-units/{productUnit}', 'update')->name('update');
        Route::delete('/product-units/{productUnit}', 'destroy')->name('destroy');
    });
    //product route
    Route::get('/products/{product}/get-product-units', [ProductController::class, 'getProductUnits'])->name('products.get-product-units');
    Route::resource('products', ProductController::class);
    // permission route
    Route::resource('permissions', PermissionController::class)->except(['create', 'edit', 'show']);
    // role route
    Route::resource('roles', RoleController::class)->except('show');
    // user route
    Route::resource('users', UserController::class);
});


require __DIR__ . '/auth.php';
