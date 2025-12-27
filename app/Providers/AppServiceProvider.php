<?php

namespace App\Providers;

use App\Models\StudentAssessmentAttempt;
use App\Policies\Student\StudentAssessmentAttemptPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
        // URL::forceScheme('https');

        Gate::policy(
            StudentAssessmentAttempt::class,
            StudentAssessmentAttemptPolicy::class
        );
    }
}
