<?php

namespace App\Http\Controllers;

use App\Models\Patron;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\LibraryCardGenerated;
use App\Services\LibraryCardService;
use Illuminate\Support\Facades\DB;

class PublicPatronController extends Controller
{
    protected $libraryCardService;

    public function __construct(LibraryCardService $libraryCardService)
    {
        $this->libraryCardService = $libraryCardService;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-ZñÑ\s\-\,]+$/'],
            'last_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-ZñÑ\s\-\,]+$/'],
            'middle_initial' => ['nullable', 'string', 'max:2', 'regex:/^[a-zA-ZñÑ]+$/'],
            'suffix' => ['nullable', 'string', 'in:JR.,SR.,I,II,III,IV,V'],

            'type' => 'required|in:Citizen,Student,Teacher/LGU Staff',

            'email' => ['required', 'email', 'unique:patrons,email'],
            'gender' => 'required|in:Male,Female,Other',

            'contact_number' => ['nullable', 'string', 'regex:/^[0-9]{11}$/'],

            'province' => 'required|string',
            'municipality' => 'required|string',
            'barangay' => 'required|string',
            'street' => 'nullable|string|max:255',
            'school' => 'nullable|required_if:type,Student|string|max:255',
        ], [
            'contact_number.regex' => 'Contact number must be exactly 11 digits.',
            'first_name.regex' => 'Names can only contain letters, spaces, dashes, and commas.',
            'last_name.regex' => 'Names can only contain letters, spaces, dashes, and commas.',
        ]);

        $genderCode = match ($validated['gender']) {
            'Male' => '01',
            'Female' => '02',
            default => '03',
        };

        $patron = DB::transaction(function () use ($validated, $genderCode) {
            $validated['library_card_number'] = $this->libraryCardService->generateSafeCardNumber($genderCode);
            return Patron::create($validated);
        });

        Mail::to($patron->email)->send(new LibraryCardGenerated($patron));

        return back()->with([
            'patron' => $patron,
            'success' => 'Registration successful!'
        ]);
    }
}
