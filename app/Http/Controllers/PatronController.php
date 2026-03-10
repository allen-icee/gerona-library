<?php

namespace App\Http\Controllers;

use App\Models\Patron;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\LibraryCardGenerated;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\PatronsExport;

class PatronController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $patrons = Patron::query()
            ->when($search, function ($query, $search) {
                $query->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('library_card_number', 'like', "%{$search}%")
                    ->orWhere('barangay', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Patrons/Index', [
            'patrons' => $patrons,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        // Notice we removed 'library_card_number' from the validation, 
        // because the controller now generates it automatically!
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-ZñÑ\s\-\,]+$/'],
            'last_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-ZñÑ\s\-\,]+$/'],
            'middle_initial' => ['nullable', 'string', 'max:2', 'regex:/^[a-zA-ZñÑ]+$/'],
            'suffix' => ['nullable', 'string', 'in:Jr.,Sr.,II,III,IV,V'],

            'type' => 'required|in:Citizen,Student,Teacher/LGU Staff',
            'gender' => 'required|in:Male,Female,Other',
            'email' => ['required', 'email', 'ends_with:@gmail.com', 'unique:patrons,email'],

            'province' => 'required|string|max:255',
            'municipality' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'street' => 'nullable|string|max:255',
            'school' => 'nullable|string|max:255',

            'contact_number' => ['nullable', 'numeric', 'digits_between:7,11'],
            'status' => 'required|in:Active,Suspended',
        ]);

        // Auto-generate the Library Card Number: GER-{GenderCode}-{Sequence}
        $genderCode = match ($request->gender) {
            'Male' => '01',
            'Female' => '02',
            default => '03',
        };

        // Find the last created patron to get the sequence number
        $lastPatron = Patron::orderBy('id', 'desc')->first();
        $nextSequence = 1;

        if ($lastPatron && preg_match('/GER-\d{2}-(\d+)/', $lastPatron->library_card_number, $matches)) {
            $nextSequence = intval($matches[1]) + 1;
        }

        $cardNumber = sprintf("GER-%s-%04d", $genderCode, $nextSequence);
        $validated['library_card_number'] = $cardNumber;

        $patron = Patron::create($validated);

        // Optional: Send the email with their new library card attached
        // Mail::to($patron->email)->send(new LibraryCardGenerated($patron));

        return redirect()->back();
    }

    public function update(Request $request, Patron $patron)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-ZñÑ\s\-\,]+$/'],
            'last_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-ZñÑ\s\-\,]+$/'],
            'middle_initial' => ['nullable', 'string', 'max:2', 'regex:/^[a-zA-ZñÑ]+$/'],
            'suffix' => ['nullable', 'string', 'in:Jr.,Sr.,II,III,IV,V'],

            'type' => 'required|in:Citizen,Student,Teacher/LGU Staff',
            'gender' => 'required|in:Male,Female,Other',

            // Allow them to keep their own email, but it must still be a gmail
            'email' => ['required', 'email', 'ends_with:@gmail.com', 'unique:patrons,email,' . $patron->id],

            'province' => 'required|string|max:255',
            'municipality' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'street' => 'nullable|string|max:255',
            'school' => 'nullable|string|max:255',

            'contact_number' => ['nullable', 'numeric', 'digits_between:7,11'],
            'status' => 'required|in:Active,Suspended',
        ]);

        // Note: We DO NOT update the library_card_number here. 
        // IDs should be permanent once generated.

        $patron->update($validated);

        return redirect()->back();
    }

    public function destroy(Patron $patron)
    {
        $patron->delete();

        return redirect()->back();
    }

    public function export()
    {
        // This will instantly download a file named "gerona_patrons.csv"
        return Excel::download(new PatronsExport, 'gerona_patrons.csv');
    }
}