<?php

namespace App\Http\Controllers;

use Exception;
use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Requests\CategoryRequest;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::latest()->paginate(5)->withQueryString();
        return Inertia::render('categories/index', compact('categories'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryRequest $request)
    {
        try {
            $categoryImagePath = null;

            if($request->hasFile('image')) {
                $categoryImagePath = $request->file('image')->store('categories', 'public');
            }

            $category = Category::create([
                'name' => $request->name,
                'slug' => Str::slug($request->name),
                'description' => $request->description,
                'image' => $categoryImagePath,
            ]);

            if($category) {
                return redirect()->route('categories.index')->with('success', 'Category successfully created.');
            }

            return redirect()->back()->with('error', 'Unable to create category.');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'An error occurred while creating the category.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryRequest $request, Category $category)
    {
        try {
            $categoryImagePath = null;

            if($request->hasFile('image')) {
                $categoryImagePath = $request->file('image')->store('categories', 'public');
            }

            $category->name = $request->name;
            $category->slug = Str::slug($request->name);
            $category->description = $request->description

;

            if($categoryImagePath) {
                $category->image = $categoryImagePath;
            }

            $category->save();

            if($category) {
                return redirect()->route('categories.index')->with('success', 'Category successfully updated.');
            }

            return redirect()->back()->with('error', 'Unable to update category.');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'An error occurred while updating the category.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        try {
            if($category) {
                $category->delete();
                return redirect()->route('categories.index')->with('success', 'Category deleted successfully.');
            }
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'An error occurred while deleting the category.');
        }
    }
}
