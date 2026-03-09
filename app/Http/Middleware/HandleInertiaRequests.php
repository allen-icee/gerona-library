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
            // Add this flash section so React can catch the success data!
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'library_card_number' => fn() => $request->session()->get('library_card_number'),
                'patron_name' => fn() => $request->session()->get('patron_name'),
                'error' => fn() => $request->session()->get('error'),
            ],
            // 🌟 Global public data for the floating marquee
            'recentDonations' => fn() => \App\Models\Donation::latest()->take(10)->get(),
        ];
    }
}