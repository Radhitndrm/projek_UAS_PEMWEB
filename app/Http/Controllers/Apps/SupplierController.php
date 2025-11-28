<?php

namespace App\Http\Controllers\Apps;

use App\Models\Order;
use App\Models\Supplier;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\SupplierRequest;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class SupplierController extends Controller implements HasMiddleware
{
    /**
     * Define middleware for the SupplierController.
     *
     * @return array
     */
    public static function middleware()
    {
        return [
            new Middleware('permission:suppliers-data', only: ['index']),
            new Middleware('permission:suppliers-create', only: ['create', 'store']),
            new Middleware('permission:suppliers-update', only: ['edit', 'update']),
            new Middleware('permission:suppliers-destroy', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // request page data
        $currentPage = request()->input('page', 1);
        $perPage = request()->input('per_page', 10);

        // get all supplier data
        $suppliers = Supplier::search()->latest()->paginate($perPage, ['*'], 'page', $currentPage)->withQueryString();

        // render view
        return inertia('apps/suppliers/index', [
            'suppliers' => $suppliers,
            'currentPage' => $currentPage,
            'perPage' => $perPage
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // generate supplier code
        $supplierCode = Supplier::generateCode('SPR');

        // render view
        return inertia('apps/suppliers/create', ['supplierCode' => $supplierCode]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SupplierRequest $request)
    {
        // create new supplier
        Supplier::create([
            'code' => $request->code,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address
        ]);

        // render view
        return to_route('apps.suppliers.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Supplier $supplier)
    {
        // render view
        return inertia('apps/suppliers/edit', ['supplier' => $supplier]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Supplier $supplier)
    {
        // update supplier data
        $supplier->update([
            'code' => $request->code,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address
        ]);

        // render view
        return to_route('apps.suppliers.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier, Request $request)
    {
        // update supplier data
        $supplier->update(['deleted_by' => $request->user()->id]);

        // delete supplier data
        $supplier->delete();

        // render view
        return to_route('apps.suppliers.index');
    }

    public function getOrders(Supplier $supplier)
    {
        $orders = Order::query()
            ->with('supplier')
            ->success()
            ->notReceived()
            ->where('supplier_id', $supplier->id)->get();

        return response()->json([
            'data' => $orders
        ]);
    }
}