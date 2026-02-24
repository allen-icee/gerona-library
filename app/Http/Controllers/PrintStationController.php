<?php

namespace App\Http\Controllers;

use App\Models\PrintLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PrintStationController extends Controller
{
    // --- PUBLIC STUDENT ROUTE ---
    public function index()
    {
        return Inertia::render('Public/PrintStation');
    }

    public function upload(Request $request)
    {
        // Notice we made name and school nullable, because they might use patron_id instead!
        $request->validate([
            'patron_id' => 'nullable|string',
            'visitor_name' => 'nullable|string|max:255',
            'school_or_barangay' => 'nullable|string|max:255',
            'paper_size' => 'required|string',
            'copies' => 'required|integer|min:1',
            'documents' => 'required|array',
            'documents.*' => 'required|file|max:204800',
        ]);

        $visitorName = $request->visitor_name;
        $school = $request->school_or_barangay;

        // If they provided a Patron ID, look them up in the database!
        if ($request->filled('patron_id')) {
            $patron = \App\Models\Patron::where('patron_id', strtoupper($request->patron_id))->first();

            if (!$patron) {
                return back()->withErrors(['patron_id' => 'Library Card Number not found. Please check and try again.']);
            }

            // Auto-fill their details for the print queue
            $visitorName = $patron->name;
            $school = $patron->address;
        } else {
            // If they are a guest, ensure they typed their name!
            $request->validate([
                'visitor_name' => 'required|string|max:255',
                'school_or_barangay' => 'required|string|max:255',
            ]);
        }

        $safeName = Str::slug($visitorName);
        $safeSchool = Str::slug($school);
        $safePaper = Str::slug($request->paper_size);
        $copies = $request->copies;

        foreach ($request->file('documents') as $file) {
            $originalName = $file->getClientOriginalName();
            $uniqueId = uniqid();
            $filename = time() . "_{$uniqueId}---{$safeName}---{$safeSchool}---{$safePaper}---{$copies}---{$originalName}";
            $file->storeAs('print_queue', $filename, 'local');
        }

        return back()->with('success', 'Files sent to the Librarian successfully!');
    }
    // --- ADMIN ROUTES ---
    public function adminIndex()
    {
        // 1. Fetch active queue
        $files = Storage::disk('local')->files('print_queue');
        $printQueue = [];

        foreach ($files as $filepath) {
            $filename = basename($filepath);
            $parts = explode('---', $filename);

            if (count($parts) >= 6) {
                $timestamp = explode('_', $parts[0])[0];
                $printQueue[] = [
                    'filename' => $filename,
                    'time_uploaded' => \Carbon\Carbon::createFromTimestamp($timestamp)->diffForHumans(),
                    'visitor_name' => ucwords(str_replace('-', ' ', $parts[1])),
                    'school_or_barangay' => ucwords(str_replace('-', ' ', $parts[2])),
                    'paper_size' => ucwords(str_replace('-', ' ', $parts[3])),
                    'copies' => $parts[4],
                    'original_name' => $parts[5],
                ];
            }
        }

        // 2. Fetch past print logs (with librarian's name)
        $printLogs = PrintLog::with('logger:id,name')->latest()->paginate(15);

        return Inertia::render('Admin/PrintStation/Index', [
            'printQueue' => $printQueue,
            'printLogs' => $printLogs
        ]);
    }

    public function download($filename)
    {
        $path = Storage::disk('local')->path('print_queue/' . $filename);
        return response()->download($path);
    }

    public function logAndClear(Request $request)
    {
        $request->validate([
            'filename' => 'required|string',
            'visitor_name' => 'required|string',
            'school_or_barangay' => 'required|string',
            'pages_printed' => 'required|integer|min:1',
        ]);

        PrintLog::create([
            'visitor_name' => $request->visitor_name,
            'school_or_barangay' => $request->school_or_barangay,
            'pages_printed' => $request->pages_printed,
            'logged_by' => Auth::id(),
            'printed_at' => now(),
        ]);

        if (Storage::disk('local')->exists('print_queue/' . $request->filename)) {
            Storage::disk('local')->delete('print_queue/' . $request->filename);
        }

        return back();
    }
}
