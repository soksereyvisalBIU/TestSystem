<?php

namespace App\Http\Controllers\Admin;

use App\Enum\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    // public function index(Request $request)
    // {
    //     $users = User::query()
    //         ->when($request->search, function ($q) use ($request) {
    //             $q->where('name', 'like', "%{$request->search}%")
    //               ->orWhere('email', 'like', "%{$request->search}%");
    //         })
    //         ->latest()
    //         ->paginate(10)
    //         ->withQueryString();

    //     return Inertia::render('admin/user-management/Index', [
    //         'users' => $users,
    //         'filters' => $request->only('search'),
    //     ]);
    // }

    // public function index(Request $request)
    // {
    //     $users = User::query()
    //         ->when($request->search, function ($q, $search) {
    //             $q->where(function ($query) use ($search) {
    //                 $query->where('name', 'like', "%{$search}%")
    //                     ->orWhere('email', 'like', "%{$search}%");
    //             });
    //         })
    //         ->latest()
    //         ->paginate(10)
    //         ->withQueryString();

    //     return Inertia::render('admin/user-management/Index', [
    //         'users' => $users,
    //         'filters' => $request->only('search'),
    //     ]);
    // }

    public function index(Request $request)
    {
        return Inertia::render('admin/user-management/Index', [
            'users' => User::query()
                ->when($request->search, function ($query, $search) {
                    $query->where(fn($q) => $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"));
                })
                ->when($request->role && $request->role !== 'all', fn($q) => $q->where('role', $request->role))
                // Performance: Dynamic Sorting
                ->orderBy($request->sort ?? 'created_at', $request->direction ?? 'desc')
                ->paginate(10)
                ->withQueryString(),
            'filters' => $request->only(['search', 'role', 'sort', 'direction']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:' . User::class,
            // 'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'string', 'min:8'],
            'role' => 'required|integer|in:1,2,3',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return back()->with('success', 'User created successfully.');
    }

public function show(User $user_management)
{
    // Load common counts
    $user = $user_management;
    $user->loadCount([
        'classrooms',
        'studentAssessment',
    ]);

    if ($user->role === UserRole::STUDENT->value) {

        $user->load([
            'classrooms:id,name,description',

            'studentAssessment' => function ($q) {
                $q->select('id', 'user_id', 'assessment_id', 'status', 'score')
                  ->with([
                      'attempts:id,student_assessment_id,status,sub_score',
                      'assessment:id,title',
                  ]);
            },
        ]);

    } elseif ($user->role === UserRole::INSTRUCTOR->value) {

        $user->load([
            'ownClassrooms:id,name,creator_id',
        ]);
    }

    // return response()->json($user);

    return Inertia::render('admin/user-management/Show', [
        'user' => $user,
    ]);
}


    public function edit(User $user_management)
    {
        return Inertia::render('admin/user-management/Edit', [
            'user' => $user_management,
        ]);
    }

    public function update(Request $request, User $user_management)
    {
        // Performance: Validate first to stop execution if data is bad
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            // Security: Ensure the ID is passed correctly to ignore the current user
            'email' => "required|string|lowercase|email|max:255|unique:users,email,{$user_management->id}",
            // Speed/UX: Password should be 'nullable' on update so you don't have to re-type it
            // 'password' => ['nullable', 'string', 'min:8'],
            'role' => 'required|integer|in:1,2,3',
        ]);

        // Performance: Use fill() to stage changes in memory before one single save() call
        $user_management->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
        ]);

        // Only hash and update password if the user actually typed a new one
        // if (!empty($validated['password'])) {
        //     $user_management->password = Hash::make($validated['password']);
        // }

        // Security check: only save if data actually changed to save database IO
        if ($user_management->isDirty()) {
            $user_management->save();
        }

        return back()->with('success', 'User updated successfully.');
    }


    public function updateRole(Request $request, User $user_management)
    {
        $request->validate([
            'role' => 'required|in:1,2,3',
        ]);

        $user_management->update([
            'role' => $request->role,
        ]);

        return back()->with('success', 'Role updated.');
    }

    // public function destroy(User $user_management)
    // {
    //     if (auth()->id() === $user_management->id) {
    //         return back()->with('error', 'You cannot delete yourself.');
    //     }

    //     $user_management->delete();

    //     return back()->with('success', 'User deleted.');
    // }


    public function bulkDestroy(Request $request)
    {
        // Security: Validate that 'ids' is an array and present
        $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'exists:users,id'
        ]);

        // Performance & Security: 
        // Filter out the current authenticated user ID directly in the SQL query.
        $deletedCount = User::whereIn('id', $request->ids)
            ->where('id', '!=', auth()->id())
            ->delete();

        // UX: Provide feedback if some users were skipped (themselves)
        if ($deletedCount < count($request->ids)) {
            return back()->with('error', 'Some users were deleted, but you cannot delete your own account.');
        }

        return back()->with('success', "Successfully deleted $deletedCount users.");
    }

    // public function bulkDestroy(Request $request)
    // public function bulkDestroy(Request $request)
    // {
    //     User::whereIn('id', $request->ids)->delete();
    //     return back()->with('success', 'Selected users deleted.');
    // }
}
