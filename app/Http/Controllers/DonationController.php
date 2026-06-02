<?php
//app\Http\Controllers\DonationController.php
namespace App\Http\Controllers;

use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\DonationsExport;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class DonationController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('role:Librarian'),
        ];
    }

    public function index(Request $request)
    {
        $donations = Donation::with('receiver:id,name')
            ->orderBy('date_received', 'desc')
            ->paginate(15);

        $totals = [
            'total_value' => Donation::sum('estimated_value'),
            'total_donations' => Donation::count(),
            'book_donations' => Donation::where('donation_category', 'Books')->count(),
            'equipment_donations' => Donation::where('donation_category', 'Equipment')->count(),
        ];

        return Inertia::render('Admin/Donations/Index', [
            'donations' => $donations,
            'totals' => $totals
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'donator_name' => 'required|string|max:255',
            'donator_type' => 'required|in:Individual,LGU Official,NGO / Foundation,Private Company',
            'donation_category' => 'required|in:Books,Equipment,Furniture,Cash Grant,Other',
            'description' => 'required|string|max:1000',
            'estimated_value' => 'nullable|numeric|min:0',
            'date_received' => 'required|date|before_or_equal:today',
        ]);

        $validated['received_by'] = Auth::id();

        Donation::create($validated);

        return redirect()->back()->with('success', 'Donation recorded successfully.');
    }
    public function update(Request $request, Donation $donation)
    {
        $validated = $request->validate([
            'donator_name' => 'required|string|max:255',
            'donator_type' => 'required|in:Individual,LGU Official,NGO / Foundation,Private Company',
            'donation_category' => 'required|in:Books,Equipment,Furniture,Cash Grant,Other',
            'description' => 'required|string|max:1000',
            'estimated_value' => 'nullable|numeric|min:0',
            'date_received' => 'required|date|before_or_equal:today',
        ]);

        $donation->update($validated);

        return redirect()->back()->with('success', 'Donation updated successfully.');
    }
    public function destroy(Donation $donation)
    {
        $donation->delete();
        return redirect()->back();
    }
    public function export()
    {
        return Excel::download(new DonationsExport, 'gerona_donations.csv');
    }
}
