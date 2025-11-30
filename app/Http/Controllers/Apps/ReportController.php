<?php

namespace App\Http\Controllers\Apps;

use Carbon\Carbon;
use App\Models\Sale;
use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use App\Models\Supplier;
use App\Models\StockMovement;
use App\Models\SaleDetail;
use App\Models\ProductUnit;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class ReportController extends Controller implements HasMiddleware
{
    /**
     * Define middleware for the ReportController.
     *
     * @return array
     */
    public static function middleware()
    {
        return [
            new Middleware('permission:report-card-stocks', only: ['cardStockView', 'cardStockReport']),
            new Middleware('permission:report-stocks', only: ['stockView', 'stockReport']),
            new Middleware('permission:report-orders', only: ['orderView', 'orderReport']),
            new Middleware('permission:report-pending-order-receives', only: ['pendingOrderReceiveView', 'pendingOrderReceiveReport']),
            new Middleware('permission:report-sales', only: ['salesView', 'salesReport']),
            new Middleware('permission:report-best-selling-products', only: ['bestSellingProductView', 'bestSellingProductReport']),
        ];
    }

    private function month()
    {
        return [
            ['value' => '1', 'label' => 'Januari'],
            ['value' => '2', 'label' => 'Februari'],
            ['value' => '3', 'label' => 'Maret'],
            ['value' => '4', 'label' => 'April'],
            ['value' => '5', 'label' => 'Mei'],
            ['value' => '6', 'label' => 'Juni'],
            ['value' => '7', 'label' => 'Juli'],
            ['value' => '8', 'label' => 'Agustus'],
            ['value' => '9', 'label' => 'September'],
            ['value' => '10', 'label' => 'Oktober'],
            ['value' => '11', 'label' => 'November'],
            ['value' => '12', 'label' => 'Desember'],
        ];
    }

    private function years($limitYear)
    {
        $currentYear = Carbon::now()->year;

        return range($currentYear, $currentYear - $limitYear);
    }

    private function products()
    {
        return Product::query()
            ->select('id', 'name')
            ->orderBy('name')
            ->get();
    }

    private function categories()
    {
        return Category::orderBy('name')->get();
    }

    private function suppliers()
    {
        return Supplier::orderBy('name')->get();
    }

    private function initialStock($date, $product_unit)
    {
        $stock = 0;

        $stockMovements = StockMovement::query()
            ->where('product_unit_id', $product_unit)
            ->where('type', 'initial')
            ->where('movement_date', $date)
            ->first();

        if (!$stockMovements)
            $stockMovements = StockMovement::query()
                ->selectRaw("
                    sum(case when type in ('in', 'initial') then quantity else 0 end) - sum(case when type='out' then quantity else 0 end) as quantity
                ")
                ->where('product_unit_id', $product_unit)
                ->where('movement_date', '<=', $date)
                ->first();

        $stock = $stockMovements->quantity;

        return $stock;
    }

    private function stockProduct($date, $product_unit)
    {
        $getStock = StockMovement::query()
            ->where('product_unit_id', $product_unit)
            ->where('movement_date', '<=', $date)
            ->selectRaw(
                "
                sum(case when type in ('in', 'initial') then quantity else 0 end) - sum(case when type='out' then quantity else 0 end) as stock"
            )
            ->first();

        return $getStock->stock;
    }

    private function stockPerDay($date, $product_unit)
    {
        $in = StockMovement::query()
            ->where('product_unit_id', $product_unit)
            ->whereIn('type', ['in', 'initial'])
            ->where('movement_date', $date)
            ->sum('quantity');

        $out = StockMovement::query()
            ->where('product_unit_id', $product_unit)
            ->where('type', 'out')
            ->where('movement_date', $date)
            ->sum('quantity');

        $stock = $this->stockProduct($date, $product_unit);

        return [
            'in' => round($in, 3),
            'out' => round($out, 3),
            'stock' => round($stock, 3),
        ];
    }

    private function detailStockTotal($firstDate, $lastDate, $product_unit)
    {
        $in = StockMovement::query()
            ->where('product_unit_id', $product_unit)
            ->whereIn('type', ['in', 'initial'])
            ->whereBetween('movement_date', [$firstDate, $lastDate])
            ->sum('quantity');

        $out = StockMovement::query()
            ->where('product_unit_id', $product_unit)
            ->where('type', 'out')
            ->whereBetween('movement_date', [$firstDate, $lastDate])
            ->sum('quantity');

        $stock = $this->stockProduct($lastDate, $product_unit);

        return [
            'in' => round($in, 3),
            'out' => round($out, 3),
            'stock' => round($stock, 3)
        ];
    }

    public function cardStockView()
    {
        return inertia('apps/reports/card-stock', [
            'months' => $this->month(),
            'products' => $this->products(),
            'years' => $this->years(3),
        ]);
    }

    public function cardStockReport(Request $request)
    {
        $response = [
            'message' => null,
            'code' => 522,
            'data' => null,
        ];

        try {
            // validate request
            $request->validate([
                'selectedMonth' => 'required',
                'selectedYear' => 'required',
                'selectedProduct' => 'required',
            ]);

            // get all request
            $selectedMonth = $request->selectedMonth;
            $selectedYear = $request->selectedYear;
            $selectedProduct = $request->selectedProduct;

            // get product unit
            $productUnit = ProductUnit::with('product', 'unit', 'product.category')->findOrFail($selectedProduct);

            // get first date from request
            $firstDate = $selectedYear . '-' . $selectedMonth . '-01';

            // get curent month
            $currentMonth = Carbon::now()->month;

            // get lastdate from request
            $currentMonth == $selectedMonth
                ? $lastDate = Carbon::now()->format('Y-m-d')
                : $lastDate = Carbon::createFromFormat('Y-m-d', $firstDate)->endOfMonth()->format('Y-m-d');

            // get periode date
            $period = CarbonPeriod::create($firstDate, $lastDate);

            // get last month stock
            $lastMonthStock = $this->initialStock($firstDate, $selectedProduct);

            $data = [];
            foreach ($period as $key => $value) {
                $thedate = $value->format('Y-m-d');
                $item['date'] = $value->format('d');
                $item['detail'] = $this->stockPerDay($thedate, $selectedProduct);
                array_push($data, $item);
            }

            // get total stock
            $total = $this->detailStockTotal($firstDate, $lastDate, $selectedProduct);

            $response['message'] = 'Success';
            $response['code'] = 200;
            $response['data'] = [
                'product' => $productUnit,
                'data' => $data,
                'month' => $selectedMonth,
                'year' => $selectedMonth,
                'lastMonthStock' => $lastMonthStock,
                'total' => $total,
            ];
        } catch (\Exception $e) {
            $response['message'] = 'An error occurred: ' . $e->getMessage();
            $response['code'] = 500;
        }

        return response()->json($response, $response['code']);
    }

    public function stockView()
    {
        return inertia('apps/reports/stock', [
            'categories' => $this->categories()
        ]);
    }

    public function stockReport(Request $request)
    {
        $response = [
            'message' => null,
            'code' => 522,
            'data' => [
                'category' => null,
                'date' => null,
                'products' => [],
            ],
        ];

        try {
            $request->validate([
                'selectedCategory' => 'required|string',
                'selectedDate' => 'required|date',
            ]);

            $selectedCategory = $request->selectedCategory;
            $selectedDate = Carbon::parse($request->input('selectedDate'))->format('Y-m-d');

            $stockReport = DB::table('products')
                ->join('product_units', 'products.id', '=', 'product_units.product_id')
                ->join('stock_movements', 'product_units.id', '=', 'stock_movements.product_unit_id')
                ->join('units', 'product_units.unit_id', '=', 'units.id')
                ->join('categories', 'products.category_id', '=', 'categories.id')
                ->select(
                    'products.sku',
                    'categories.name as category',
                    'products.name as product_name',
                    'product_units.name as name',
                    'units.name as unit',
                    'product_units.barcode',
                    DB::raw('(
                SUM(CASE WHEN stock_movements.type IN ("initial", "in") THEN stock_movements.quantity ELSE 0 END)
                -
                SUM(CASE WHEN stock_movements.type = "out" THEN stock_movements.quantity ELSE 0 END)
            ) as remaining_stock')
                )
                ->when($selectedCategory !== 'all', function ($query) use ($selectedCategory) {
                    return $query->where('products.category_id', $selectedCategory);
                })
                ->groupBy(
                    'products.sku',
                    'products.id',
                    'product_units.id',
                    'categories.name',
                    'products.name',
                    'product_units.name',
                    'units.name',
                    'product_units.barcode'
                )
                ->having('remaining_stock', '>', 0)
                ->get();

            $data = [];
            foreach ($stockReport as $row) {
                $sku = $row->sku;

                if (!isset($data[$sku])) {
                    $data[$sku] = [
                        'name' => $row->product_name,
                        'details' => [],
                    ];
                }

                $data[$sku]['details'][] = [
                    'sku' => $sku,
                    'name' => $row->name,
                    'category' => $row->category,
                    'barcode' => $row->barcode,
                    'product_unit' => $row->unit,
                    'remaining_stock' => $row->remaining_stock,
                ];
            }

            $response['message'] = count($stockReport) > 0 ? 'Success' : 'Data not found';
            $response['code'] = count($stockReport) > 0 ? 200 : 404;
            $response['data'] = [
                'category' => $selectedCategory,
                'date' => $selectedDate,
                'products' => array_values($data),
            ];
        } catch (\Exception $e) {
            $response['message'] = 'An error occurred: ' . $e->getMessage();
            $response['code'] = 500;
            $response['data'] = [
                'category' => $selectedCategory ?? null,
                'date' => $selectedDate ?? null,
                'products' => [],
            ];
        }

        return response()->json($response, 200);
    }

    public function orderView()
    {
        $purchase = Order::query()
            ->select('id', 'order_date')
            ->orderBy('order_date', 'asc')
            ->value('order_date');

        $today = Carbon::now()->format('Y-m-d');

        return inertia('apps/reports/order', [
            'suppliers' => $this->suppliers(),
            'lastPurchase' => $purchase,
            'today' => $today,
        ]);
    }

    public function orderReport(Request $request)
    {
        $response = [
            'message' => null,
            'code' => 522,
            'data' => null,
        ];

        try {
            $startDate = $request->from;
            $endDate = $request->to;

            $orders = Order::query()
                ->where('status', 'success')
                ->with([
                    'supplier',
                    'order_details',
                    'order_details.product_unit',
                    'order_details.product_unit.product',
                    'order_details.product_unit.unit',
                ])
                ->whereBetween('order_date', [$startDate, $endDate])
                ->get();

            $orders->each(function ($order) {
                $order->order_details->each(function ($orderDetail) {
                    $orderDetail->total_price = number_format($orderDetail->price * $orderDetail->quantity, '0', ',', '.');
                    $orderDetail->price = number_format($orderDetail->price, '0', ',', '.');
                });
            });

            if (count($orders) > 0) {
                $response['message'] = 'Success';
                $response['code'] = 200;
                $response['data'] = $orders;
            } else {
                $response['message'] = 'Data not found';
                $response['code'] = 404;
                $response['data'] = [];
            }
        } catch (\Exception $e) {
            $response['message'] = 'An error occurred: ' . $e->getMessage();
            $response['code'] = 500;
        }

        return response()->json($response, 200);
    }

    public function pendingOrderReceiveView()
    {
        $purchase = Order::query()
            ->select('id', 'order_date')
            ->orderBy('order_date', 'asc')
            ->value('order_date');

        $today = Carbon::now()->format('Y-m-d');

        return inertia('apps/reports/pending-order-receive', [
            'suppliers' => $this->suppliers(),
            'lastPurchase' => $purchase,
            'today' => $today,
        ]);
    }

    public function pendingOrderReceiveReport(Request $request)
    {
        $response = [
            'message' => null,
            'code' => 522,
            'data' => null,
        ];

        try {
            $startDate = $request->from;
            $endDate = $request->to;
            $supplier = $request->supplier;

            $orders = Order::with('supplier')
                ->withCount('order_details')
                ->where('status', 'success')
                ->when($supplier, function ($query, $supplier) {
                    return $query->where('supplier_id', $supplier);
                })->whereDoesntHave('order_receives', function ($query) {
                    $query->where('status', 'success');
                })
                ->whereBetween('order_date', [$startDate, $endDate])->get()->map(function ($order) {
                    $order->total_amount = number_format($order->total_amount, 0, ',', '.');

                    return $order;
                });


            if (count($orders) > 0) {
                $response['message'] = 'Success';
                $response['code'] = 200;
                $response['data'] = $orders;
            } else {
                $response['message'] = 'Data not found';
                $response['code'] = 404;
                $response['data'] = [];
            }
        } catch (\Exception $e) {
            $response['message'] = 'An error occurred: ' . $e->getMessage();
            $response['code'] = 500;
        }

        return response()->json($response, 200);
    }

    public function salesView()
    {
        $sale = Sale::query()
            ->select('id', 'sale_date')
            ->orderBy('sale_date', 'asc')
            ->value('sale_date');

        $today = Carbon::now()->format('Y-m-d');

        return inertia('apps/reports/sale', [
            'lastSale' => $sale,
            'today' => $today,
        ]);
    }

    public function salesReport(Request $request)
    {
        $response = [
            'message' => null,
            'code' => 522,
            'data' => null,
        ];

        try {
            $startDate = $request->from;
            $endDate = $request->to;

            $sales = Sale::query()
                ->with([
                    'sale_details',
                    'sale_details.product_unit',
                    'sale_details.product_unit.product',
                    'sale_details.product_unit.unit',
                ])
                ->whereBetween('sale_date', [$startDate, $endDate])
                ->get();

            $sales->each(function ($sale) {
                $sale->formatted_amount = number_format($sale->total_amount, 0, ',', '.');
                $sale->sale_details->each(function ($saleDetail) {
                    $saleDetail->total_price = number_format($saleDetail->price * $saleDetail->quantity, 0, ',', '.');
                    $saleDetail->price = number_format($saleDetail->price, 0, ',', '.');
                });
            });

            if (count($sales) > 0) {
                $response['message'] = 'Success';
                $response['code'] = 200;
                $response['data'] = $sales;
            } else {
                $response['message'] = 'Data not found';
                $response['code'] = 404;
                $response['data'] = [];
            }
        } catch (\Exception $e) {
            $response['message'] = 'An error occurred: ' . $e->getMessage();
            $response['code'] = 500;
        }

        return response()->json($response, 200);
    }

    public function bestSellingProductView()
    {
        $sale = Sale::query()
            ->select('id', 'sale_date')
            ->orderBy('sale_date', 'asc')
            ->value('sale_date');

        $today = Carbon::now()->format('Y-m-d');

        return inertia('apps/reports/best-selling-product', [
            'lastSale' => $sale,
            'today' => $today,
        ]);
    }

    public function bestSellingProductReport(Request $request)
    {
        $response = [
            'message' => null,
            'code' => 522,
            'data' => null,
        ];

        try {
            $startDate = $request->from;
            $endDate = $request->to;

            $bestSellingProduct = SaleDetail::query()
                ->select(
                    DB::raw('MIN(products.sku) as sku'),
                    DB::raw('MIN(products.name) as product_name'),
                    DB::raw('MIN(product_units.name) as unit_name'),
                    DB::raw('MIN(product_units.barcode) as barcode'),
                    DB::raw('MIN(units.name) as unit'),
                    DB::raw('MIN(sale_details.price) as price'),
                    DB::raw('SUM(sale_details.price * sale_details.quantity) as total_revenue'),
                    DB::raw('SUM(sale_details.quantity) as total_sale')
                )
                ->join('product_units', 'sale_details.product_unit_id', '=', 'product_units.id')
                ->join('units', 'product_units.unit_id', '=', 'units.id')
                ->join('products', 'product_units.product_id', '=', 'products.id')
                ->join('sales', 'sale_details.sale_id', '=', 'sales.id')
                ->whereBetween('sale_date', [$startDate, $endDate])
                ->groupBy('product_units.id')
                ->orderBy('total_sale', 'DESC')
                ->orderBy('total_revenue', 'DESC')
                ->get()
                ->map(function ($item) {
                    $item->total_sale = number_format($item->total_sale, 0, ',', '.');
                    $item->price = number_format($item->price, 0, ',', '.');
                    $item->total_revenue_formatted = number_format($item->total_revenue, 0, ',', '.');
                    return $item;
                });

            if ($bestSellingProduct->count() > 0) {
                $response['message'] = 'Success';
                $response['code'] = 200;
                $response['data'] = $bestSellingProduct;
            } else {
                $response['message'] = 'Data not found';
                $response['code'] = 404;
                $response['data'] = [];
            }
        } catch (\Exception $e) {
            $response['message'] = 'An error occurred: ' . $e->getMessage();
            $response['code'] = 500;
        }

        return response()->json($response, 200);
    }
}
