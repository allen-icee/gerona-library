<?php

namespace App\Http\Controllers;

use App\Models\Patron;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\LibraryCardGenerated;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\PatronsExport;
use App\Services\LibraryCardService;
use Illuminate\Support\Facades\DB;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class PatronController extends Controller implements HasMiddleware
{
    protected $libraryCardService;

    public function __construct(LibraryCardService $libraryCardService)
    {
        $this->libraryCardService = $libraryCardService;
    }

    public static function middleware(): array
    {
        return [
            new Middleware('role:Librarian'),
        ];
    }

    public function index(Request $request)
    {
        $search = $request->input('search');

        $patrons = Patron::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('library_card_number', 'like', "%{$search}%")
                        ->orWhere('barangay', 'like', "%{$search}%");
                });
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
            'first_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-ZñÑ\s\-\,]+$/'],
            'last_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-ZñÑ\s\-\,]+$/'],
            'middle_initial' => ['nullable', 'string', 'max:2', 'regex:/^[a-zA-ZñÑ]+$/'],
            'suffix' => ['nullable', 'string', 'in:JR.,SR.,I,II,III,IV,V'],

            'type' => 'required|in:Citizen,Student,Teacher/LGU Staff',
            'gender' => 'required|in:Male,Female,Other',
            'email' => ['required', 'email', 'unique:patrons,email'],

            'province' => 'required|string|max:255',
            'municipality' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'street' => 'nullable|string|max:255',
            'school' => 'nullable|string|max:255',

            'contact_number' => ['nullable', 'numeric', 'digits_between:7,11'],
            'status' => 'required|in:Active,Suspended',
        ]);

        $genderCode = match ($request->gender) {
            'Male' => '01',
            'Female' => '02',
            default => '03',
        };

        $patron = DB::transaction(function () use ($validated, $genderCode) {
            $validated['library_card_number'] = $this->libraryCardService->generateSafeCardNumber($genderCode);
            return Patron::create($validated);
        });

        Mail::to($patron->email)->send(new LibraryCardGenerated($patron));

        return redirect()->back()->with('success', 'Patron registered successfully.');
    }

    public function update(Request $request, Patron $patron)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-ZñÑ\s\-\,]+$/'],
            'last_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-ZñÑ\s\-\,]+$/'],
            'middle_initial' => ['nullable', 'string', 'max:2', 'regex:/^[a-zA-ZñÑ]+$/'],
            'suffix' => ['nullable', 'string', 'in:JR.,SR.,I,II,III,IV,V'],

            'type' => 'required|in:Citizen,Student,Teacher/LGU Staff',
            'gender' => 'required|in:Male,Female,Other',

            'email' => ['required', 'email', 'unique:patrons,email,' . $patron->id],

            'province' => 'required|string|max:255',
            'municipality' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'street' => 'nullable|string|max:255',
            'school' => 'nullable|string|max:255',

            'contact_number' => ['nullable', 'numeric', 'digits_between:7,11'],
            'status' => 'required|in:Active,Suspended',
        ]);

        $patron->update($validated);

        return redirect()->back()->with('success', 'Patron updated successfully.');
    }

    public function destroy(Patron $patron)
    {
        $patron->delete();
        return redirect()->back()->with('success', 'Patron removed successfully.');
    }

    public function export()
    {
        return Excel::download(new PatronsExport, 'gerona_patrons.csv');
    }
}
