<?php
//app\Http\Controllers\PatronController.php
namespace App\Http\Controllers;

use App\Models\Patron;
use App\Http\Requests\StorePatronRequest;
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

    public function store(StorePatronRequest $request)
    {
        $validated = $request->validated();

        $genderCode = match ($validated['gender']) {
            'Male' => '01',
            'Female' => '02',
            default => '03',
        };

        $patron = DB::transaction(function () use ($validated, $genderCode) {
            $validated['library_card_number'] = $this->libraryCardService->generateSafeCardNumber($genderCode);
            return Patron::create($validated);
        });

        Mail::to($patron->email)->queue(new LibraryCardGenerated($patron));

        return redirect()->back()->with('success', 'Patron registered successfully.');
    }

    public function update(StorePatronRequest $request, Patron $patron)
    {
        $patron->update($request->validated());

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
