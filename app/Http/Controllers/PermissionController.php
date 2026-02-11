<?php

namespace App\Http\Controllers;

use App\Http\Requests\PermissionRequest;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // dump($request->all());
        $permissionsQuery = Permission::query();

        // Get all the permissions
        $totalCount = $permissionsQuery->count();

        // Check if the search query matches any of the data in the database
        if($request->filled('search')) {
            $search = $request->search;

            $permissionsQuery->where(fn($query) =>
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('label', 'like', "%{$search}%")
                    ->orWhere('module', 'like', "%{$search}%")
            );
        }

        // Number of permissions that matches the search query
        // Filtered search count
        $filteredCount = $permissionsQuery->count();

        $perPage = (int) ($request->perPage ?? 5);

        // Fetch all permission
        if($perPage === -1) {
            $allPermissions = Permission::latest()->get()->map(fn($permission) => [
                "id" => $permission->id,
                "label"=> $permission->label,
                "description" => $permission->description,
                "module" => $permission->module,
            ]);

            $permissions = [
                'data' => $allPermissions,
                'total' => $filteredCount,
                'perPage' => $perPage,
                'from' => 1,
                'to' => $filteredCount,
                'links' => [],
            ];
        } else {
            // This will fetch all the filtered permissions that matches the (1)search query and (2)per page count
            $permissions = $permissionsQuery->latest()->paginate($perPage)->withQueryString();

            $permissions->getCollection()->transform(fn($permission) => [
            // $products = Product::latest()->get()->map(fn($product) => [
                "id" => $permission->id,
                "label"=> $permission->label,
                "description" => $permission->description,
                "module" => $permission->module,
            ]);
        }

        // Fetch all the products that matches the search query
        $filters = $request->only(['search', 'perPage']);
        return Inertia::render('permissions/index', compact('permissions', 'filters', 'totalCount', 'filteredCount'));
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
    public function store(PermissionRequest $request)
    {
        $permission = Permission::create([
            'module' => $request->module,
            'label' => Str::title($request->label),
            'name' => Str::slug($request->label),
            'description' => $request->description,
        ]);

        if($permission) {
            return redirect()->route('permissions.index')->with('success', 'Permission created successfully.');
        }

        return redirect()->back()->with('error', 'Unable to create permission, try again.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PermissionRequest $request, Permission $permission)
    {
        if($permission) {
            $permission->module = $request->module;
            $permission->label = Str::ucfirst($request->label);
            $permission->name = Str::slug($request->label);
            $permission->description = $request->description;

            $permission->save();
            return redirect()->route('permissions.index')->with('success', 'Permission updated successfully.');
        }

        return redirect()->back()->with('error', 'Unable to update permission, try again.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission)
    {
        if($permission) {
            $permission->delete();
            return redirect()->route('permissions.index')->with('success', 'Permission deleted successfully.');
        }
        return redirect()->back()->with('error', 'Unable to delete permission, try again.');
    }
}
