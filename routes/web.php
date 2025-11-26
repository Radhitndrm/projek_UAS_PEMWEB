<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function(){
    if(Auth::check())
        return to_route('apps.dashboard');

    return inertia('auth/login');
});


require __DIR__.'/auth.php';