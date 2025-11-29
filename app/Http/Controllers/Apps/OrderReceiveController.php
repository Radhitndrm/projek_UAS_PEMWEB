<?php

namespace App\Http\Controllers\Apps;

use App\Models\Order;
use App\Models\Supplier;
use App\Models\OrderReceive;
use Illuminate\Http\Request;
use App\Models\StockMovement;
use App\Http\Controllers\Controller;
use App\Http\Requests\OrderReceiveRequest;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class OrderReceiveController extends Controller implements HasMiddleware
{
    /**
     * Define middleware for the OrderReceiveController.
     *
     * @return array
     */
    public static function middleware()
    {
        return [
            new Middleware('permission:order-receives-data', only: ['index']),
            new Middleware('permission:order-receives-create', only: ['create', 'store']),
            new Middleware('permission:order-receives-update', only: ['edit', 'update']),
            new Middleware('permission:order-receives-delete', only: ['destroy']),
            new Middleware('permission:order-receives-show', only: ['show']),
            new Middleware('permission:order-receives-verification', only: ['updateStatus']),
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

        // get all order data
        $orderReceives = OrderReceive::query()
            ->search()
            ->with('order', 'order.supplier')
            ->latest()
            ->paginate($perPage, ['*'], 'page', $currentPage)
            ->withQueryString();

        // transform data
        $orderReceives->getCollection()->transform(function($item){
            $item->order->total_amount = number_format($item->order->total_amount, 0, ',', '.');

            return $item;
        });

        // render view
        return inertia('apps/order-receives/index', [
            'orderReceives' => $orderReceives,
            'currentPage' => $currentPage,
            'perPage' => $perPage,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // get all supplier data
        $suppliers = Supplier::all();

        // render view
        return inertia('apps/order-receives/create', [
            'suppliers' => $suppliers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(OrderReceiveRequest $request)
    {
        // create new order receive
        $orderReceive = OrderReceive::create([
            'receive_code' => $request->receive_code,
            'order_id' => $request->order_id,
            'receive_date' => $request->receive_date,
            'created_by' => $request->user()->id,
        ]);

        collect($request->details)->each(function($item) use($orderReceive){
            $orderReceive->order_receive_details()->create([
                'order_detail_id' => $item['id'],
            ]);
        });

        // render view
        return to_route('apps.order-receives.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(OrderReceive $orderReceive)
    {
        $orderReceive->load([
            'order',
            'order.supplier',
            'order_receive_details',
            'order_receive_details.order_detail',
            'order_receive_details.order_detail.order',
            'order_receive_details.order_detail.product_unit',
            'order_receive_details.order_detail.product_unit.product',
            'order_receive_details.order_detail.product_unit.unit',
        ]);

        $orderReceive->order->total_amount = number_format($orderReceive->order->total_amount, 0, ',', '.');
        $orderReceive->order_receive_details->map(function($detail){
            $detail->order_detail->total_price = number_format($detail->order_detail->price * $detail->order_detail->quantity, 0, ',', '.');
            $detail->order_detail->formatted_price = number_format($detail->order_detail->price, 0, ',', '.');

            return $detail;
        });

        // render view
        return inertia('apps/order-receives/show', [
            'orderReceive' => $orderReceive
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(OrderReceive $orderReceive)
    {
        // get all supplier data
        $suppliers = Supplier::all();

        // get orders data
        $orders = Order::with('order_details')
            ->success()
            ->where('supplier_id', $orderReceive->order->supplier_id)
            ->get();

        // load relationship
        $orderReceive->load([
            'order',
            'order.supplier',
            'order.order_details',
            'order.order_details.product_unit',
            'order.order_details.product_unit.product',
            'order.order_details.product_unit.unit',
            'order_receive_details',
        ]);

        $orderReceive->order->order_details->map(function($detail){
            $detail->total_price = number_format($detail->price * $detail->quantity, 0, ',', '.');
            $detail->formatted_price = number_format($detail->price, 0, ',', '.');

            return $detail;
        });

        // render view
        return inertia('apps/order-receives/edit', [
            'orderReceive' => $orderReceive,
            'suppliers' => $suppliers,
            'orders' => $orders
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(OrderReceiveRequest $request, OrderReceive $orderReceive)
    {
        // update order receive data
        $orderReceive->update([
            'receive_code' => $request->receive_code,
            'receive_date' => $request->receive_date,
        ]);

        // render view
        return to_route('apps.order-receives.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OrderReceive $orderReceive, Request $request)
    {
        // delete order receive
        $orderReceive->update(['deleted_by' => $request->user()->id]);
        $orderReceive->order_receive_details()->each(function($detail) use($request) {
            $detail->update(['deleted_by' => $request->user()->id]);
        });
        $orderReceive->order_receive_details()->delete();
        $orderReceive->delete();

        // render view
        return back();
    }

    public function updateStatus(Request $request, OrderReceive $orderReceive, $status)
    {
        // update order receive status
        $orderReceive->update([
            'status' => $status,
            'status_changed_at' => now(),
            'status_changed_by' => $request->user()->id,
        ]);

        if($status === 'success'){
            $orderReceive->order_receive_details()->each(function($detail) use($orderReceive) {
                StockMovement::create([
                    'product_unit_id' => $detail->order_detail->product_unit_id,
                    'quantity' => $detail->order_detail->quantity,
                    'type' => 'in',
                    'price' => $detail->order_detail->price,
                    'description' => 'purchase',
                    'movement_date' => $orderReceive->receive_date,
                ]);
            });
        }

        // render view
        return back();
    }
}