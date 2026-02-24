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
            'name' => 'required|string|max:255',
            'type' => 'required|string', // e.g., Student, Professional
            'contact_number' => 'required|string|max:255',
            'address' => 'required|string|max:255', // School or Barangay
        ]);

        // Auto-generate the next PAT-XXXXX ID
        $latestPatron = Patron::latest('id')->first();
        $nextId = $latestPatron ? $latestPatron->id + 1 : 1;
        $patronId = 'PAT-' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

        $validated['patron_id'] = $patronId;
        $validated['status'] = 'Active';

        $patron = Patron::create($validated);

        // Return back with their new ID so they can see it!
        return back()->with([
            'success' => true,
            'new_patron_id' => $patron->patron_id,
            'patron_name' => $patron->name
        ]);
    }
}
