<?php

namespace App\Http\Controllers;

use App\Models\VisitorLog;
use App\Models\Patron;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\VisitorLogsExport;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class VisitorLogController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            // Only lock down the admin viewing and exporting features
            new Middleware('role:Librarian', only: ['adminIndex', 'export']),
        ];
    }

    public function adminIndex(Request $request)
    {
        $query = VisitorLog::query();

        if ($request->has('history') && $request->history === 'true') {
            $logs = $query->orderBy('time_in', 'desc')->paginate(15);
        } else {
            $logs = $query->whereNull('time_out')->orderBy('time_in', 'desc')->paginate(15);
        }

        return Inertia::render('Admin/Kiosk/Index', [
            'visitorLogs' => $logs,
            'isHistoryMode' => $request->history === 'true'
        ]);
    }

    public function store(Request $request)
    {
        $visitorName = $request->visitor_name;
        $address = $request->address;
        $patronId = null;

        if ($request->filled('library_card_number')) {
            $patron = Patron::where('library_card_number', strtoupper($request->library_card_number))->first();

            if (!$patron) {
                return back()->withErrors(['library_card_number' => 'Library Card Number not found. Please try again or sign in as a guest.']);
            }

            $request->validate(['purpose' => 'required|string|max:255']);

            $patronId = $patron->id;
            $visitorName = $patron->first_name . ' ' . $patron->last_name;
            $address = $patron->school ?? $patron->barangay;
        } else {
            $request->validate([
                'visitor_name' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'purpose' => 'required|string|max:255',
            ]);
        }

        VisitorLog::create([
            'patron_id' => $patronId, // Save the ID
            'visitor_name' => $visitorName,
            'address' => $address,
            'purpose' => $request->purpose,
            'time_in' => now(),
        ]);

        return redirect()->back()->with('success', 'Welcome to the Library, ' . $visitorName . '!');
    }

    public function checkout(VisitorLog $visitorLog)
    {
        $visitorLog->update(['time_out' => now()]);
        return redirect()->back()->with('success', 'Time out logged successfully. Goodbye!');
    }

    public function export()
    {
        return Excel::download(new VisitorLogsExport, 'gerona_kiosk_logs.csv');
    }

    public function smartScan(Request $request)
    {
        $request->validate([
            'library_card_number' => 'required|string',
            'purpose' => 'nullable|string',
        ]);

        $patron = Patron::where('library_card_number', strtoupper($request->library_card_number))->first();

        if (!$patron) {
            return back()->withErrors(['error' => 'Card not found. Please register or sign in as guest.']);
        }

        // Match by patron_id for perfect accuracy
        $activeLog = VisitorLog::where('patron_id', $patron->id)
            ->whereNull('time_out')
            ->first();

        if ($activeLog) {
            $activeLog->update(['time_out' => now()]);
            return back()->with('success', "Goodbye, {$patron->first_name}! You have been timed out.");
        } else {
            if (!$request->purpose) {
                return back()->withErrors(['needs_purpose' => 'true']);
            }

            VisitorLog::create([
                'patron_id' => $patron->id, // Save the ID
                'visitor_name' => trim("{$patron->first_name} " . ($patron->middle_initial ? "{$patron->middle_initial}. " : "") . "{$patron->last_name} {$patron->suffix}"),
                'address' => "Brgy. {$patron->barangay}, {$patron->municipality}",
                'purpose' => $request->purpose,
                'time_in' => now(),
            ]);
            return back()->with('success', "Welcome to the library, {$patron->first_name}!");
        }
    }
}
