<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('roles')->latest()->paginate(5);
        $roles = Role::get();

        return Inertia::render('users/index', compact('users', 'roles'));
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
    public function store(UserRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        if($user) {
            $user->syncRoles($request->roles);

            return redirect()->route('users.index')->with('success', 'User successfully created, alongside its role.');
        }
        return redirect()->back()->with('error', 'Unable to create user, please try again.');
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
    public function update(UserRequest $request, User $user)
    {
        if($user) {
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
            $user->save();

            $user->syncRoles($request->roles);

            return redirect()->route('users.index')->with('success', 'User successfully created, alongside its role.');
        }
        return redirect()->back()->with('error', 'Unable to create user, please try again.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        if($user) {
            $user->delete();
            return redirect()->route('users.index')->with('success', 'User deleted successfully.');
        }
        return redirect()->back()->with('error', 'Unable to delete user, please try again.');
    }
}
