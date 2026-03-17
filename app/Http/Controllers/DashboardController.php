<?php
//app\Http\Controllers\DashboardController.php
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
        if ($request->user()->hasRole('Kiosk')) {
            $activeVisitors = VisitorLog::whereNull('time_out')
                ->whereDate('time_in', today())
                ->orderBy('time_in', 'desc')
                ->get(['id', 'visitor_name', 'address', 'time_in']);

            return Inertia::render('Kiosk/Dashboard', [
                'activeVisitors' => $activeVisitors
            ]);
        }

        return Inertia::render('Admin/Dashboard/Index', [
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