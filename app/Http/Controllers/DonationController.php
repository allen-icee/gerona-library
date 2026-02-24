<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DonationController extends Controller
{
    public function index(Request $request)
    {
        $donations = Donation::with('receiver:id,name')
            ->orderBy('date_received', 'desc')
            ->paginate(15);

        // Calculate totals for the dashboard metric cards
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
            'donator_type' => 'required|string',
            'donation_category' => 'required|string',
            'description' => 'required|string',
            'estimated_value' => 'nullable|numeric|min:0',
            'date_received' => 'required|date',
        ]);

        $validated['received_by'] = Auth::id();

        Donation::create($validated);

        return redirect()->back();
    }

    public function destroy(Donation $donation)
    {
        $donation->delete();
        return redirect()->back();
    }
}
