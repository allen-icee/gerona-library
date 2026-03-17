<?php
//app\Http\Middleware\HandleInertiaRequests.php
namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * @var string
     */
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
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

                    'roles' => $request->user()->getRoleNames(),
                ] : null,
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'patron' => fn() => $request->session()->get('patron'),
                'error' => fn() => $request->session()->get('error'),
            ],
            'recentDonations' => fn() => \App\Models\Donation::latest()->take(10)->get(),
        ];
    }
}