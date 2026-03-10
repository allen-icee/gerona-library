<?php

namespace App\Http\Controllers;

use App\Models\Patron;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\LibraryCardGenerated;

class PublicPatronController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Strict Regex validations
            'first_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-ZñÑ\s\-\,]+$/'],
            'last_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-ZñÑ\s\-\,]+$/'],
            'middle_initial' => ['nullable', 'string', 'max:2', 'regex:/^[a-zA-ZñÑ]+$/'],
            'suffix' => ['nullable', 'string', 'in:JR.,SR.,I,II,III,IV,V'],

            'type' => 'required|in:Citizen,Student,Teacher/LGU Staff',

            // Email must be gmail
            'email' => ['required', 'email', 'ends_with:@gmail.com', 'unique:patrons,email'],
            'gender' => 'required|in:Male,Female,Other',

            // Contact must be exactly 11 digits
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

        // 4. Save Patron to Database
        $patron = Patron::create($validated);

        // 5. Send the Email
        Mail::to($patron->email)->send(new LibraryCardGenerated($patron));

        // 6. Return Success to the Frontend
        // THIS IS THE CHANGED PART: Flashing the whole patron object
        return back()->with([
            'patron' => $patron,
            'success' => 'Registration successful!'
        ]);
    }
}