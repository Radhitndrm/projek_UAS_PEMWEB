<?php

namespace App\Http\Controllers\Apps;

use App\Models\Order;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\OrderDetail;
use Illuminate\Http\Request;
use App\Http\Requests\OrderRequest;
use App\Http\Controllers\Controller;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class OrderController extends Controller implements HasMiddleware
{
    /**
     * Define middleware for the OrderController.
     *
     * @return array
     */
    public static function middleware()
    {
        return [
            new Middleware('permission:orders-data', only: ['index']),
            new Middleware('permission:orders-create', only: ['create', 'store']),
            new Middleware('permission:orders-update', only: ['edit', 'update']),
            new Middleware('permission:orders-delete', only: ['destroy']),
            new Middleware('permission:orders-show', only: ['show']),
            new Middleware('permission:orders-verification', only: ['updateStatus']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $currentPage = $request->input('page', 1);
        $perPage = $request->input('per_page', 10);

        $suppliers = Supplier::query()->select('id', 'name', 'code')->get();

        $orders = Order::query()
            ->search()
            ->with('supplier')
            ->withCount('order_details')
            ->latest()
            ->paginate($perPage, ['*'], 'page', $currentPage)
            ->withQueryString();

        $orders->getCollection()->transform(function ($item) {
            $item->total_amount = number_format($item->total_amount, 0, ',', '.');

            return $item;
        });

        return inertia('apps/orders/index', [
            'orders' => $orders,
            'currentPage' => $currentPage,
            'perPage' => $perPage,
            'suppliers' => $suppliers
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $suppliers = Supplier::query()->select('id', 'name', 'code')->get();

        $products = Product::query()
            ->select('id', 'name')
            ->orderBy('products.name')
            ->get();

        return inertia('apps/orders/create', [
            'suppliers' => $suppliers,
            'products' => $products
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(OrderRequest $request)
    {
        $order = Order::create([
            'order_code' => $request->order_code,
            'supplier_id' => $request->supplier_id,
            'order_date' => $request->order_date,
            'status' => 'pending',
            'total_amount' => $request->grand_price,
            'created_by' => $request->user()->id,
            'status_changed_by' => $request->user()->id,
        ]);

        collect($request->items)->each(function ($item) use ($order) {
            $order->order_details()->create([
                'product_unit_id' => $item['product_unit'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);
        });

        return to_route('apps.orders.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(order $order)
    {
        $order->load('supplier', 'order_details', 'order_details.product_unit', 'order_details.product_unit.product', 'order_details.product_unit.unit');

        $order->total_amount = number_format($order->total_amount, 0, ',', '.');

        $order->order_details->each(function ($detail) {
            $detail->total_price = number_format($detail->price * $detail->quantity, 0, ',', '.');
            $detail->price = number_format($detail->price, 0, ',', '.');
        });

        // render view
        return inertia('apps/orders/show', ['order' => $order]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(order $order)
    {
        $suppliers = Supplier::query()->select('id', 'name', 'code')->get();

        $products = Product::query()
            ->select('id', 'name')
            ->orderBy('products.name')
            ->with('product_units')
            ->get();

        $order->load([
            'supplier',
            'order_details',
            'order_details.product_unit',
            'order_details.product_unit.product',
            'order_details.product_unit.unit',
            'order_details.product_unit.product.product_units',
            'order_details.product_unit.product.product_units.unit'
        ]);

        return inertia('apps/orders/edit', [
            'order' => $order,
            'suppliers' => $suppliers,
            'products' => $products,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(OrderRequest $request, order $order)
    {
        $order->update([
            'order_code' => $request->order_code,
            'supplier_id' => $request->supplier_id,
            'order_date' => $request->order_date,
            'status' => 'pending',
            'total_amount' => $request->grand_price
        ]);

        $currentDetails = $order->order_details()->get()->keyBy('product_unit_id');

        $newDetails = collect($request->items)->keyBy('product_unit');

        $toKeep = [];
        $toDelete = $currentDetails->keys()->diff($newDetails->keys());

        $newDetails->each(function ($item, $productUnitId) use ($currentDetails, &$toKeep, $toDelete) {
            if ($currentDetails->has($productUnitId)) {
                $existing = $currentDetails[$productUnitId];

                if ($item['quantity'] == $existing->quantity && $item['price'] == $existing->unit_price)
                    $toKeep[] = $productUnitId;
                else
                    $toDelete[] = $productUnitId;
            }
        });

        $order->order_details()->whereIn('product_unit_id', $toDelete)
            ->update(['deleted_by' => $request->user()->id]);
        $order->order_details()->whereIn('product_unit_id', $toDelete)
            ->delete();

        $newDetails->except($toKeep)->each(function ($item) use ($order) {
            $order->order_details()->create([
                'product_unit_id' => $item['product_unit'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);
        });

        return to_route('apps.orders.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order, Request $request)
    {
        // delete purchase order
        $order->update(['deleted_by' => $request->user()->id]);
        $order->order_details()->each(function ($detail) use ($request) {
            $detail->update(['deleted_by' => $request->user()->id]);
        });
        $order->order_details()->delete();
        $order->delete();

        // render view
        return back();
    }

    public function updateStatus(Request $request, Order $order, $status)
    {
        $order->update([
            'status' => $status,
            'status_changed_at' => now(),
            'status_changed_by' => $request->user()->id,
        ]);

        return back();
    }

    public function getOrderDetails(Order $order)
    {
        // get order details
        $order_details = OrderDetail::query()
            ->with(['product_unit', 'product_unit.unit', 'product_unit.product'])
            ->where('order_id', $order->id)->get()
            ->map(function ($detail) {
                $detail->total_price = number_format($detail->price * $detail->quantity, 0, ',', '.');
                $detail->formatted_price = number_format($detail->price, 0, ',', '.');

                return $detail;
            });

        // render view
        return response()->json([
            'data' => $order_details
        ]);
    }
}
