<?php

namespace App\Http\Controllers;

use App\Models\VisitorLog;
use App\Models\Patron;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VisitorLogController extends Controller
{
    public function store(Request $request)
    {
        $visitorName = $request->visitor_name;
        $address = $request->address;

        // 1. If they provided a Patron ID, look them up!
        if ($request->filled('patron_id')) {
            $patron = Patron::where('patron_id', strtoupper($request->patron_id))->first();

            if (!$patron) {
                return back()->withErrors(['patron_id' => 'Library Card Number not found. Please try again or sign in as a guest.']);
            }

            $request->validate([
                'purpose' => 'required|string|max:255',
            ]);

            // Auto-fill from database
            $visitorName = $patron->name;
            $address = $patron->address;
        } else {
            // 2. Otherwise, they are a guest and must type everything
            $request->validate([
                'visitor_name' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'purpose' => 'required|string|max:255',
            ]);
        }

        // 3. Log them in
        VisitorLog::create([
            'visitor_name' => $visitorName,
            'address' => $address,
            'purpose' => $request->purpose,
            'time_in' => now(),
        ]);

        return redirect()->back();
    }

    public function checkout(VisitorLog $visitorLog)
    {
        $visitorLog->update([
            'time_out' => now(),
        ]);

        return redirect()->back();
    }
}
