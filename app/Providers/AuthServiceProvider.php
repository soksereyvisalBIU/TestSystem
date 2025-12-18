<?php

namespace App\Providers;

use App\Enum\UserRole;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Gate::define(
            'access-admin-page',
            fn($user) =>
            $user->role === UserRole::ADMIN
        );

        Gate::define(
            'access-instructor-page',
            fn($user) =>
            in_array($user->role, [UserRole::INSTRUCTOR, UserRole::ADMIN])
        );

        Gate::define('access-admin-page', function ($user) {
            return $user->role >= 3;
        });

        Gate::define('access-instructor-page', function ($user) {
            return $user->role >= 2;
        });
    }
}
