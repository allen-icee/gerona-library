<?php

namespace App\Http\Controllers;

use App\Models\BookCopy;
use App\Models\Patron;
use App\Models\VisitorLog;
use App\Models\BorrowTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // 1. If the user is just a Kiosk account, send them straight to the public kiosk view
        if ($request->user()->hasRole('Kiosk')) {
            $activeVisitors = VisitorLog::whereNull('time_out')
                ->whereDate('time_in', today())
                ->orderBy('time_in', 'desc')
                ->get(['id', 'visitor_name', 'address', 'time_in']);

            return Inertia::render('Kiosk/Dashboard', [
                'activeVisitors' => $activeVisitors
            ]);
        }

        // 2. If the user is an Admin/Librarian, render the newly refactored Admin Dashboard
        return Inertia::render('Admin/Dashboard/Index', [ // <--- Updated path here
            'metrics' => [
                'totalCopies' => BookCopy::count(),
                'activePatrons' => Patron::where('status', 'Active')->count(),
                'todaysVisitors' => VisitorLog::whereDate('created_at', Carbon::today())->count(),
                'overdueBooks' => BorrowTransaction::where('status', 'Borrowed')
                    ->where('due_at', '<', Carbon::now())
                    ->count(),
            ]
        ]);
    }
}