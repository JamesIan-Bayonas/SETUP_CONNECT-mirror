<?php

namespace App\Providers;

use App\Enums\UserType;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        Gate::define('manage-users', function ($user) {
            return $user->user_type === UserType::ADMIN || $user->user_type === UserType::PSTO_STAFF;
        });

        Gate::define('manage-org-types', function ($user) {
            return $user->user_type === UserType::ADMIN;
        });

        Gate::define('manage-document-types', function ($user) {
            return $user->user_type === UserType::ADMIN ||
                   $user->user_type === UserType::PSTO_STAFF;
        });
    }
}
