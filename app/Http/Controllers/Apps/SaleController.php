<?php

namespace App\Http\Controllers\Apps;

use App\Models\Sale;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use App\Http\Requests\SaleRequest;
use App\Http\Controllers\Controller;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class SaleController extends Controller implements HasMiddleware
{
    /**
     * Define middleware for the SaleController.
     *
     * @return array
     */
    public static function middleware()
    {
        return [
            new Middleware('permission:sales-data', only: ['index']),
            new Middleware('permission:sales-create', only: ['create', 'store']),
            new Middleware('permission:sales-show', only: ['show']),
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

        // get all sale data
        $sales = Sale::query()
            ->search()
            ->with('user')
            ->withCount('sale_details')
            ->latest()
            ->paginate($perPage, ['*'], 'page', $currentPage)
            ->withQueryString();

        // transform data
        $sales->getCollection()->transform(function($item){
            $item->total_amount = number_format($item->total_amount, 0, ',', '.');

            return $item;
        });

        // render view
        return inertia('apps/sales/index', [
            'sales' => $sales,
            'currentPage' => $currentPage,
            'perPage' => $perPage
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // get all product data
        $products = Product::query()
            ->select('id', 'name')
            ->orderBy('products.name')
            ->get();

        // render view
        return inertia('apps/sales/create', [
            'products' => $products
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SaleRequest $request)
    {
        // create new sale
        $sale = Sale::create([
            'sale_code' => $request->sale_code,
            'customer' => $request->customer,
            'sale_date' => $request->sale_date,
            'payment_method' => $request->payment_method,
            'total_amount' => $request->grand_price,
            'created_by' => $request->user()->id,
        ]);

        // create sale detail
        collect($request->items)->each(function($item) use($sale){
            $sale->sale_details()->create([
                'product_unit_id' => $item['product_unit'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);

            // create stock movement
            StockMovement::create([
                'product_unit_id' => $item['product_unit'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'type' => 'out',
                'description' => 'sales',
                'movement_date' => $sale->sale_date,
            ]);
        });

        // redirect to sale index
        return to_route('apps.sales.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Sale $sale)
    {
        // load relationship
        $sale->load([
            'sale_details',
            'sale_details.product_unit',
            'sale_details.product_unit.product',
            'sale_details.product_unit.unit',
        ]);

        $sale->total_amount = number_format($sale->total_amount, 0, ',', '.');

        // calculate total amount
        $sale->sale_details->each(function($detail) {
            $detail->total_price = number_format($detail->price * $detail->quantity, 0, ',', '.');
            $detail->price = number_format($detail->price, 0, ',', '.');
        });

        // render view
        return inertia('apps/sales/show', [
            'sale' => $sale
        ]);
    }
}