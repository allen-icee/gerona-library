<?php
// app/Http/Controllers/DashboardController.php

namespace App\Http\Controllers;

use App\Models\BookCopy;
use App\Models\Patron;
use App\Models\VisitorLog;
use App\Models\BorrowTransaction;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $metrics = [
            'totalCopies' => BookCopy::count(),
            'activePatrons' => Patron::where('status', 'Active')->count(),

            'todaysVisitors' => VisitorLog::whereDate('time_in', today())->count(),
            'overdueBooks' => BorrowTransaction::where('status', 'Overdue')
                ->orWhere(function ($query) {
                    $query->where('status', 'Borrowed')
                        ->where('due_at', '<', now());
                })->count(),
        ];

        $last7Days = collect(range(6, 0))->mapWithKeys(function ($daysAgo) {
            return [now()->subDays($daysAgo)->format('M d') => 0];
        });

        $visitorData = VisitorLog::select(DB::raw('DATE(time_in) as date'), DB::raw('count(*) as count'))
            ->where('time_in', '>=', now()->subDays(6)->startOfDay())
            ->groupBy('date')
            ->get()
            ->pluck('count', 'date');

        foreach ($visitorData as $date => $count) {
            $formattedDate = Carbon::parse($date)->format('M d');
            if (isset($last7Days[$formattedDate])) {
                $last7Days[$formattedDate] = $count;
            }
        }

        $visitorChartData = $last7Days->map(fn($count, $date) => [
            'name' => $date,
            'visitors' => $count
        ])->values();

        $circulationChartData = collect(range(6, 0))->map(function ($daysAgo) {
            $date = now()->subDays($daysAgo);
            return [
                'name' => $date->format('M d'),
                'borrowed' => BorrowTransaction::whereDate('borrowed_at', $date)->count(),
                'returned' => BorrowTransaction::whereDate('returned_at', $date)->count(),
            ];
        });

        return Inertia::render('Admin/Dashboard/Index', [
            'metrics' => $metrics,
            'charts' => [
                'visitors' => $visitorChartData,
                'circulation' => $circulationChartData,
            ]
        ]);
    }
}