<?php

namespace App\Http\Controllers;

use Exception;
use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\ProductFormRequest;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        
        // Get all the products first
        $products = Product::query();

        // Check if the search query matches any of the data in the database
        if($request->filled('search')) {
            $search = $request->search;

            $products->where(fn($query) =>
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('price', 'like', "%{$search}%")
            );
        }

        // This will fetch all the filtered products that matches the search query
        $products = $products->latest()->paginate(3)->withQueryString();

        $products->getCollection()->transform(fn($product) => [
        // $products = Product::latest()->get()->map(fn($product) => [
            "id" => $product->id,
            "name"=> $product->name,
            "description" => $product->description,
            "price" => $product->price,
            "featured_image" => $product->featured_image,
            "featured_image_original_name" => $product->featured_image_original_name,
            "created_at" => $product->created_at->format('d M Y'),
        ]);
        // dd($products);
        
        // Fetch all the products that matches the search query
        $filters = $request->only(['search']);
        return Inertia::render('products/index', compact('products', 'filters'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('products/product-form');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductFormRequest $request)
    {
        try {
            $featuredImage = null;
            $featuredImageOriginalName = null; // Initialize so that if no image is uploaded, it will just labeled as null

            if($request->hasFile('featured_image')) {
                $featuredImage = $request->file('featured_image');
                $featuredImageOriginalName = $featuredImage->getClientOriginalName();
                $featuredImage = $featuredImage->store('products', 'public');
            }

            $product = Product::create([
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'featured_image' => $featuredImage,
                'featured_image_original_name' => $featuredImageOriginalName,
            ]);

            if($product) {
                return redirect()->route('products.index')->with('success', 'Product created successfully');
            }

            return redirect()->back()->with('error', 'Product creation failed, please try again.');
        } catch (Exception $e) {
            Log::error('Product creation failed:' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        // dd($product);
        $viewMode = true;
        return Inertia::render('products/product-form', compact('product', 'viewMode'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $editMode = true;
        return Inertia::render('products/product-form', compact('product', 'editMode'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductFormRequest $request, Product $product)
    {
        try {
            if($product) {
                $product->name = $request->name;
                $product->description = $request->description;
                $product->price = $request->price;

                if($request->file('featured_image')) {
                    $featuredImage = $request->file('featured_image');
                    $featuredImageOriginalName = $featuredImage->getClientOriginalName();
                    $featuredImage = $featuredImage->store('products', 'public');

                    $product->featured_image = $featuredImage;
                    $product->featured_image_original_name = $featuredImageOriginalName;
                }
                $product->save();

                return redirect()->route('products.index')->with('success', 'Product updated successfully.');
            }
        } catch (Exception $e) {
            Log::error('Product update failed: ' . $e->getMessage());
        }

        return redirect()->back()->with('error', 'Unable to update, please try again.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // dd($product);
        try {
            if($product) {
                $product->delete();

                return redirect()->back()->with('success', 'Product deleted successfully.');
            }
        } catch (Exception $e) {
            Log::error('Product deletion failed:' . $e->getMessage());
        }

        return redirect()->back()->with('error', 'Product deletion failed, please try again.');
    }
}
