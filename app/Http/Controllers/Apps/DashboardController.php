<?php

namespace App\Http\Controllers\Apps;

use App\Models\Sale;
use App\Models\Order;
use App\Models\ProductUnit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $totalPurchaseThisMonth = Order::query()
            ->where('status', 'success')
            ->whereMonth('order_date', date('m'))
            ->sum('total_amount');

        $totalSalesThisMonth = Sale::query()
            ->whereMonth('sale_date', date('m'))
            ->sum('total_amount');

        $totalRevenueThisMonth = number_format($totalSalesThisMonth - $totalPurchaseThisMonth, 0);

        $totalPurchaseThisMonth = number_format($totalPurchaseThisMonth, 0);
        $totalSalesThisMonth   = number_format($totalSalesThisMonth, 0);

        /**
         * STOCK MOVEMENT (MySQL)
         */
        $stockMovements = DB::table('stock_movements')
            ->select(
                DB::raw("DATE_FORMAT(movement_date, '%M') as month"),
                DB::raw("SUM(CASE WHEN type = 'in' THEN quantity ELSE 0 END) as in_stock"),
                DB::raw("SUM(CASE WHEN type = 'out' THEN quantity ELSE 0 END) as out_stock")
            )
            ->where('movement_date', '>=', DB::raw("DATE_SUB(NOW(), INTERVAL 6 MONTH)"))
            ->groupBy(DB::raw("DATE_FORMAT(movement_date, '%M')"))
            ->orderBy(DB::raw("DATE_FORMAT(movement_date, '%m')"))
            ->get()
            ->map(function ($item) {
                return [
                    'month'     => $item->month,
                    'in_stock'  => $item->in_stock,
                    'out_stock' => $item->out_stock,
                ];
            });

        /**
         * 🔥 BEST SELLING PRODUCT (fixed ONLY_FULL_GROUP_BY)
         */
        $bestSellingProduct = ProductUnit::query()
            ->selectRaw('
                products.name AS product_name,
                product_units.name AS product_unit_name,
                SUM(sale_details.quantity) AS total_quantity
            ')
            ->join('sale_details', 'sale_details.product_unit_id', '=', 'product_units.id')
            ->join('products', 'products.id', '=', 'product_units.product_id')
            ->groupBy('sale_details.product_unit_id', 'products.name', 'product_units.name')
            ->orderByDesc('total_quantity')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'product'  => $item->product_name . ' ' . $item->product_unit_name,
                    'quantity' => $item->total_quantity
                ];
            });

        // Render view
        return inertia('apps/dashboard', [
            'totalPurchaseThisMonth' => $totalPurchaseThisMonth,
            'totalSalesThisMonth' => $totalSalesThisMonth,
            'stockMovements' => $stockMovements,
            'totalRevenueThisMonth' => $totalRevenueThisMonth,
            'bestSellingProduct' => $bestSellingProduct
        ]);
    }
}
