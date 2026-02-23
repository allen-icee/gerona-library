<?php

namespace App\Http\Controllers;

use App\Models\VisitorLog;
use Illuminate\Http\Request;

class VisitorLogController extends Controller
{
    // Handles the "Time In"
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Regex strictly allows only letters, spaces, hyphens, and periods.
            'visitor_name' => ['required', 'string', 'max:255', 'regex:/^[\pL\s\-\.]+$/u'],
            'address' => 'required|string|max:255',
            'school' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:20',
            'purpose' => 'required|string|max:255',
            'signature' => 'nullable|string',
        ], [
            // Custom error message for the React frontend
            'visitor_name.regex' => 'Please enter a valid name (letters only, no numbers).',
        ]);

        VisitorLog::create($validated);

        return redirect()->back();
    }

    // Handles the "Time Out"
    public function checkout(VisitorLog $visitorLog)
    {
        // Stamps the exact current time into the database
        $visitorLog->update(['time_out' => now()]);

        return redirect()->back();
    }
}
