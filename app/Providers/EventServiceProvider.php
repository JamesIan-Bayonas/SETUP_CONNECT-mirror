<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     * 
     * Laravel 11+ automatically discovers event listeners in app/Listeners.
     * Only add manual mappings here if you need to override auto-discovery.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        // Event listeners are auto-discovered
    ];
}


