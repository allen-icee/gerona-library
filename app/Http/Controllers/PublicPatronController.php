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
        return Inertia::render('Public/Register');
    }

    // Save the new patron and generate their ID
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Regex allows letters, spaces, dashes, commas, and ñ/Ñ
            'first_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-ZñÑ\s\-\,]+$/'],
            'last_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-ZñÑ\s\-\,]+$/'],
            'middle_initial' => ['nullable', 'string', 'max:2', 'regex:/^[a-zA-ZñÑ]+$/'],
            'suffix' => ['nullable', 'string', 'in:JR.,SR.,I,II,III,IV,V'],

            'type' => 'required|in:Citizen,Student,Teacher/LGU Staff',

            // Strict Gmail validation
            'email' => ['required', 'email', 'ends_with:@gmail.com', 'unique:patrons,email'],
            'gender' => 'required|in:Male,Female,Other',

            // Strict 11 digit numbers
            'contact_number' => ['nullable', 'string', 'regex:/^[0-9]{11}$/'],

            'province' => 'required|string',
            'municipality' => 'required|string',
            'barangay' => 'required|string',
            'street' => 'nullable|string|max:255',
            'school' => 'nullable|required_if:type,Student|string|max:255',
        ], [
            'email.ends_with' => 'Only @gmail.com email addresses are allowed.',
            'contact_number.regex' => 'Contact number must be exactly 11 digits.',
            'first_name.regex' => 'Names can only contain letters, spaces, dashes, and commas.',
            'last_name.regex' => 'Names can only contain letters, spaces, dashes, and commas.',
        ]);

        // 1. Map Gender Code
        $genderCode = match ($validated['gender']) {
            'Male' => '01',
            'Female' => '02',
            default => '03',
        };

        // 2. Get Next Sequence (e.g. 0001)
        $lastPatron = Patron::orderBy('id', 'desc')->first();
        $nextSequence = 1;

        if ($lastPatron && preg_match('/GER-\d{2}-(\d+)/', $lastPatron->library_card_number, $matches)) {
            $nextSequence = intval($matches[1]) + 1;
        }

        // 3. Assemble ID
        $validated['library_card_number'] = sprintf("GER-%s-%04d", $genderCode, $nextSequence);

        // Save
        $patron = Patron::create($validated);

        // Return back with their new ID so the frontend can generate the QR Code
        return back()->with([
            'success' => true,
            'library_card_number' => $patron->library_card_number,
            'patron_name' => $patron->first_name . ' ' . $patron->last_name
        ]);
    }
}