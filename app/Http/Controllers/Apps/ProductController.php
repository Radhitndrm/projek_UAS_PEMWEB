<?php

namespace App\Http\Controllers\Apps;

use App\Models\Product;
use App\Models\Category;
use App\Models\ProductUnit;
use Illuminate\Http\Request;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller implements HasMiddleware
{
    /**
     * Define middleware for the ProductController.
     *
     * @return array
     */
    public static function middleware()
    {
        return [
            new Middleware('permission:products-data', only: ['index']),
            new Middleware('permission:products-create', only: ['create', 'store']),
            new Middleware('permission:products-update', only: ['edit', 'update']),
            new Middleware('permission:products-show', only: ['show']),
            new Middleware('permission:products-delete', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $currentPage = $request->input('page', 1);
        $perPage = $request->input('per_page', 10);

        $products = Product::search()
            ->with('category')
            ->latest()
            ->paginate($perPage, ['*'], 'page', $currentPage)
            ->withQueryString();

        $categories = Category::query()->select('id', 'name')->get();

        return inertia('apps/products/index', [
            'products'     => $products,
            'currentPage'  => $currentPage,
            'perPage'      => $perPage,
            'categories'   => $categories
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::query()->select('id', 'name')->get();

        return inertia('apps/products/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request)
    {
        // Upload image (POST wajib)
        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }

        Product::create([
            'name'        => $request->name,
            'sku'         => $request->sku,
            'category_id' => $request->category_id,
            'description' => $request->description,
            'image'       => $imagePath,
        ]);

        return to_route('apps.products.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load([
            'category:id,name',
            'product_units:id,product_id,unit_id,barcode,name,price,image',
            'product_units.unit:id,name'
        ]);

        $stocks = StockMovement::query()
            ->select('product_unit_id', DB::raw('SUM(CASE WHEN type in ("in", "initial") THEN quantity ELSE - quantity END) as stock'))
            ->groupBy('product_unit_id')
            ->pluck('stock', 'product_unit_id');

        $product->product_units->each(function ($unit) use ($stocks) {
            $unit->stock = $stocks[$unit->id] ?? 0;
            $unit->price = number_format($unit->price, 0, ',', '.');
            $unit->image_url = $unit->image ? asset('storage/' . $unit->image) : null;
        });

        $product->image_url = $product->image
            ? asset('storage/' . $product->image)
            : null;

        return inertia('apps/products/show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $categories = Category::query()->select('id', 'name')->get();

        return inertia('apps/products/edit', [
            'categories' => $categories,
            'product'    => $product
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, Product $product)
    {
        $imagePath = $product->image;

        if ($request->hasFile('image')) {

            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }

            $imagePath = $request->file('image')->store('products', 'public');
        }

        $product->update([
            'name'        => $request->name,
            'sku'         => $request->sku,
            'category_id' => $request->category_id,
            'description' => $request->description,
            'image'       => $imagePath,
        ]);

        return to_route('apps.products.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product, Request $request)
    {
        $product->update(['deleted_by' => $request->user()->id]);

        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return back();
    }

    /**
     * Get product units
     */
    public function getProductUnits(Request $request, Product $product)
    {
        $initalRequest = $request->initialStock;

        if ($initalRequest) {
            $alreadyHaveIntialStock = StockMovement::where('type', 'initial')
                ->groupBy('product_unit_id')
                ->pluck('product_unit_id');
        }

        $productUnits = ProductUnit::with('unit')
            ->where('product_id', $product->id);

        $productUnits = $initalRequest
            ? $productUnits->whereNotIn('id', $alreadyHaveIntialStock)->get()
            : $productUnits->get();

        return response()->json([
            'data' => $productUnits
        ]);
    }
}
