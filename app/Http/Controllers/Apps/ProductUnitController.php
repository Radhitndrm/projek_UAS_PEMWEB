<?php

namespace App\Http\Controllers\Apps;

use App\Models\Unit;
use App\Models\Product;
use App\Models\ProductUnit;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProductUnitRequest;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Storage;

class ProductUnitController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('permission:product-variants-create', only: ['create', 'store']),
            new Middleware('permission:product-variants-update', only: ['edit', 'update']),
            new Middleware('permission:product-variants-destroy', only: ['destroy']),
        ];
    }

    public function create(Product $product)
    {
        $units = Unit::query()->select('id', 'name')->get();

        return inertia('apps/product-units/create', [
            'product' => $product,
            'units'   => $units
        ]);
    }

    public function store(Product $product, ProductUnitRequest $request)
    {
        collect($request->items)->each(function ($item) use ($product) {

            // Upload gambar jika ada
            $imagePath = null;
            if (isset($item['image']) && $item['image']) {
                $imagePath = $item['image']->store('product_units', 'public');
            }

            $product->product_units()->create([
                'barcode' => $item['barcode'],
                'name'    => $item['name'],
                'unit_id' => $item['unit'],
                'price'   => $item['price'],
                'image'   => $imagePath, // simpan gambar
            ]);
        });

        return to_route('apps.products.show', $product->id);
    }

    public function edit(Product $product, ProductUnit $productUnit)
    {
        $units = Unit::query()->select('id', 'name')->get();

        return inertia('apps/product-units/edit', [
            'productUnit' => $productUnit,
            'units'       => $units,
            'product'     => $product
        ]);
    }

    public function update(ProductUnitRequest $request, Product $product, ProductUnit $productUnit)
    {
        $imagePath = $productUnit->image;

        // Jika ada gambar baru
        if ($request->hasFile('image')) {

            // Hapus gambar lama
            if ($productUnit->image && Storage::disk('public')->exists($productUnit->image)) {
                Storage::disk('public')->delete($productUnit->image);
            }

            $imagePath = $request->file('image')->store('product_units', 'public');
        }

        $productUnit->update([
            'barcode' => $request->barcode,
            'name'    => $request->name,
            'unit_id' => $request->unit_id,
            'price'   => $request->price,
            'image'   => $imagePath, // update image
        ]);

        return to_route('apps.products.show', $product->id);
    }

    public function destroy(ProductUnit $productUnit, Request $request)
    {
        $productUnit->update(['deleted_by' => $request->user()->id]);

        // Hapus gambar dari storage
        if ($productUnit->image && Storage::disk('public')->exists($productUnit->image)) {
            Storage::disk('public')->delete($productUnit->image);
        }

        $productUnit->delete();

        return back();
    }
}
