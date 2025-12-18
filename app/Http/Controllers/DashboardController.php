<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // $this->middleware(function ($request, $next) {

        $user = auth()->user();

        // if (Gate::allows('access-admin-page')) {
        //     return redirect()->route('admin.dashboard');
        // }

        // if (Gate::allows('access-instructor-page')) {
        //     return redirect()->route('instructor.dashboard');
        // }

        // return redirect()->route('student.dashboard');


        if (Gate::allows('access-admin-page')) {
            return Inertia::render('admin-dashboard');
        }

        if (Gate::allows('access-instructor-page')) {
            return Inertia::render('instructor-dashboard');
        }

        return Inertia::render('student-dashboard');
        // });
    }
}
