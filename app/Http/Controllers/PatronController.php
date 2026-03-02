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
                    ->orWhere('school_or_barangay', 'like', "%{$search}%");
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
        $validated = $request->validate([
            'library_card_number' => 'required|string|unique:patrons,library_card_number',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'type' => 'required|in:Citizen,Student,Teacher/LGU Staff',
            'email' => 'required|email|unique:patrons,email',
            'gender' => 'required|in:Male,Female,Other',
            'province' => 'required|string|max:255',
            'municipality' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'street' => 'nullable|string|max:255',
            'school' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:255',
            'status' => 'required|in:Active,Suspended',
        ]);

        $patron = Patron::create($validated);

        Mail::to($patron->email)->send(new LibraryCardGenerated($patron));

        return redirect()->back();
    }

    public function update(Request $request, Patron $patron)
    {
        $validated = $request->validate([
            'library_card_number' => 'required|string|unique:patrons,library_card_number,' . $patron->id,
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'school_or_barangay' => 'required|string|max:255',
            'contact_number' => 'nullable|string|max:255',
            'status' => 'required|in:Active,Suspended',
        ]);

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
