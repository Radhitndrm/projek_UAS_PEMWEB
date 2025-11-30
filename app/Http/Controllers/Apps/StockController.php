<?php

namespace App\Http\Controllers\Apps;

use Carbon\Carbon;
use App\Models\Product;
use App\Models\ProductUnit;
use Illuminate\Http\Request;
use App\Models\StockMovement;
use App\Http\Controllers\Controller;
use App\Http\Requests\StockInitialRequest;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class StockController extends Controller implements HasMiddleware
{
    /**
     * Define middleware for the StockController.
     *
     * @return array
     */
    public static function middleware()
    {
        return [
            new Middleware('permission:stocks-data', only: ['stockInitialView']),
            new Middleware('permission:stocks-create', only: ['stockInitialStore']),
        ];
    }

    public function stockInitialView(Request $request)
    {
        // already have intialStock
        $alreadyHaveInitialStock = StockMovement::where('type', 'initial')->groupBy('product_unit_id')->pluck('product_unit_id');

        // get all product data
        $products = Product::query()
            ->whereHas('product_units', function ($query) use ($alreadyHaveInitialStock) {
                $query->whereNotIn('id', $alreadyHaveInitialStock);
            })
            ->select('id', 'name')
            ->get();

        // render view
        return inertia('apps/stocks/stock-initials', ['products' => $products]);
    }

    public function stockInitialStore(StockInitialRequest $request)
    {
        // create stock movement
        StockMovement::create([
            'product_unit_id' => $request->product_unit,
            'type' => 'initial',
            'quantity' => $request->quantity,
            'description' => 'initial-stock',
            'price' => $request->price,
            'movement_date' => Carbon::now(),
        ]);

        // render view
        return back();
    }
}
