<?php

namespace App\Providers;

use App\Events\CustomerApplicationApproved;
use App\Listeners\SendManifestationOfIntentListener;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        CustomerApplicationApproved::class => [
            SendManifestationOfIntentListener::class,
        ],
    ];
}


