<?php

namespace App\Http\Controllers\Apps;

use App\Models\Unit;
use Illuminate\Http\Request;
use App\Http\Requests\UnitRequest;
use App\Http\Controllers\Controller;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class UnitController extends Controller implements HasMiddleware
{
    /**
     * Define middleware for the UnitController.
     *
     * @return array
     */
    public static function middleware()
    {
        return [
            new Middleware('permission:units-data', only: ['index']),
            new Middleware('permission:units-create', only: ['create', 'store']),
            new Middleware('permission:units-update', only: ['edit', 'update']),
            new Middleware('permission:units-destroy', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // request page data
        $currentPage = $request->input('page', 1);
        $perPage = $request->input('per_page', 10);

        // get all unit data
        $units = Unit::search()->latest()->paginate($perPage, ['*'], 'page', $currentPage)->withQueryString();

        // render view
        return inertia('apps/units/index', [
            'units' => $units,
            'currentPage' => $currentPage,
            'perPage' => $perPage
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // render view
        return inertia('apps/units/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UnitRequest $request)
    {
        // create unit
        Unit::create([
            'name' => $request->name,
            'description' => $request->description
        ]);

        // render view
        return to_route('apps.units.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Unit $unit)
    {
        // render view
        return inertia('apps/units/edit', ['unit' => $unit]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UnitRequest $request, Unit $unit)
    {
        // update unit data
        $unit->update([
            'name' => $request->name,
            'description' => $request->description
        ]);

        // render view
        return to_route('apps.units.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Unit $unit)
    {
        // delete unit data
        $unit->delete();

        // render view
        return back();
    }
}