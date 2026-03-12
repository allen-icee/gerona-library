<?php

namespace App\Http\Controllers;

use App\Models\VisitorLog;
use App\Models\Patron;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\VisitorLogsExport;

class VisitorLogController extends Controller
{
    public function adminIndex(Request $request)
    {
        $query = VisitorLog::query();

        // If they want to see history instead of just active people
        if ($request->has('history') && $request->history === 'true') {
            $logs = $query->orderBy('time_in', 'desc')->paginate(15);
        } else {
            // Default: Show only people currently inside
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

        // 1. If the webcam scanned a QR Code, look them up!
        if ($request->filled('library_card_number')) {
            $patron = Patron::where('library_card_number', strtoupper($request->library_card_number))->first();

            if (!$patron) {
                return back()->withErrors(['library_card_number' => 'Library Card Number not found. Please try again or sign in as a guest.']);
            }

            // We still want to know WHY they are visiting today
            $request->validate([
                'purpose' => 'required|string|max:255',
            ]);

            // Auto-fill from database (fixing the column mismatches)
            $visitorName = $patron->first_name . ' ' . $patron->last_name;
            $address = $patron->school_or_barangay;
        } else {
            // 2. Otherwise, they are a guest and must type everything manually
            $request->validate([
                'visitor_name' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'purpose' => 'required|string|max:255',
            ]);
        }

        // 3. Log them in (Time_in is handled automatically by the DB migration)
        VisitorLog::create([
            'visitor_name' => $visitorName,
            'address' => $address,
            'purpose' => $request->purpose,
            'time_in' => now(),
        ]);

        return redirect()->back()->with('success', 'Welcome to the Library, ' . $visitorName . '!');
    }

    public function checkout(VisitorLog $visitorLog)
    {
        $visitorLog->update([
            'time_out' => now(),
        ]);

        return redirect()->back()->with('success', 'Time out logged successfully. Goodbye!');
    }
    public function export()
    {
        return Excel::download(new VisitorLogsExport, 'gerona_kiosk_logs.csv');
    }

    // Add this inside VisitorLogController
    public function smartScan(Request $request)
    {
        $request->validate([
            'library_card_number' => 'required|string',
            'purpose' => 'required|string', // We need this in case they are timing in
        ]);

        $patron = Patron::where('library_card_number', strtoupper($request->library_card_number))->first();

        if (!$patron) {
            return back()->withErrors(['error' => 'Card not found. Please register or sign in as guest.']);
        }

        $visitorName = $patron->first_name . ' ' . $patron->last_name;

        // Check if this person is ALREADY inside (time_out is null)
        $activeLog = VisitorLog::where('visitor_name', $visitorName)
            ->whereNull('time_out')
            ->first();

        if ($activeLog) {
            // THEY ARE INSIDE -> Time them out!
            $activeLog->update(['time_out' => now()]);
            return back()->with('success', "Goodbye, {$patron->first_name}! You have been timed out.");
        } else {
            // THEY ARE NOT INSIDE -> Time them in!
            VisitorLog::create([
                'visitor_name' => $visitorName,
                'address' => $patron->school_or_barangay,
                'purpose' => $request->purpose,
                'time_in' => now(),
            ]);
            return back()->with('success', "Welcome to the library, {$patron->first_name}!");
        }
    }
}
