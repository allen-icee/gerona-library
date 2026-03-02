<?php

namespace App\Http\Controllers;

use App\Models\Patron;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicPatronController extends Controller
{
    // Show the public registration page
    public function create()
    {
        return Inertia::render('Public/RegisterPatron');
    }

    // Save the new patron and generate their ID
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'type' => 'required|string', // e.g., Student, Teacher, General Public
            'contact_number' => 'nullable|string|max:255',
            'school_or_barangay' => 'required|string|max:255', // Open to everyone!
        ]);

        // Auto-generate the next GER-YYYY-XXXXX ID
        $latestPatron = Patron::latest('id')->first();
        $nextId = $latestPatron ? $latestPatron->id + 1 : 1;
        $cardNumber = 'GER-' . date('Y') . '-' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

        $validated['library_card_number'] = $cardNumber;
        $validated['status'] = 'Active';

        $patron = Patron::create($validated);

        // Return back with their new ID so the frontend can generate the QR Code!
        return back()->with([
            'success' => true,
            'library_card_number' => $patron->library_card_number,
            'patron_name' => $patron->first_name . ' ' . $patron->last_name
        ]);
    }
}
