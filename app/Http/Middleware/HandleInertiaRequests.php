<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    // Grab the Spatie roles and pass them to React
                    'roles' => $request->user()->getRoleNames(),
                ] : null,
            ],
            // THIS IS THE CHANGED PART: Catching the full patron object
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'patron' => fn() => $request->session()->get('patron'), // We added this!
                'error' => fn() => $request->session()->get('error'),
            ],
            // 🌟 Global public data for the floating marquee
            'recentDonations' => fn() => \App\Models\Donation::latest()->take(10)->get(),
        ];
    }
}