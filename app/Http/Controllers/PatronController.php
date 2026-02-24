<?php

namespace App\Http\Controllers;

use App\Models\Patron;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
            'type' => 'required|string|max:255',
            'school_or_barangay' => 'required|string|max:255',
            'contact_number' => 'nullable|string|max:255',
            'status' => 'required|in:Active,Suspended',
        ]);

        Patron::create($validated);

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
}
