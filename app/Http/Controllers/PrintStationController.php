<?php

namespace App\Http\Controllers;

use App\Models\PrintLog;
use App\Models\VisitorLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\PrintLogsExport;

class PrintStationController extends Controller
{
    // --- KIOSK API LINKUP ---
    public function activeVisitors()
    {
        // Fetch visitors who have timed in but haven't timed out yet
        return response()->json(
            VisitorLog::whereNull('time_out')
                ->select('id', 'visitor_name', 'school', 'address')
                ->orderBy('time_in', 'desc')
                ->get()
        );
    }

    // --- PUBLIC STUDENT ROUTE ---
    public function index()
    {
        return Inertia::render('Public/Print');
    }

    public function upload(Request $request)
    {
        $request->validate([
            'visitor_name' => 'required|string|max:255',
            'school_or_barangay' => 'nullable|string|max:255',
            'documents' => 'required|array|min:1',
            'documents.*.file' => 'required|file|max:204800', // 200MB max per file
            'documents.*.custom_name' => 'required|string|max:255',
            'documents.*.copies' => 'required|integer|min:1',
            'documents.*.paper_size' => 'required|string',
            'documents.*.pages' => 'required|string', // Added validation for pages
        ]);

        $safeName = Str::slug($request->visitor_name);
        $safeSchool = Str::slug($request->school_or_barangay ?? 'Guest');

        foreach ($request->documents as $doc) {
            $file = $doc['file'];
            $customName = Str::slug($doc['custom_name']);
            $copies = $doc['copies'];
            $safePaper = Str::slug($doc['paper_size']);
            // Convert pages like "1-3, 5" to a safe string. 
            // Using a simple replace to avoid losing the numbers.
            $safePages = preg_replace('/[^a-zA-Z0-9,-]/', '_', $doc['pages']);
            if (empty($safePages))
                $safePages = 'All';

            $extension = $file->getClientOriginalExtension();
            $uniqueId = uniqid();

            // Format: timestamp_uniqid---Name---School---Paper---Copies---Pages---CustomName.ext
            $filename = time() . "_{$uniqueId}---{$safeName}---{$safeSchool}---{$safePaper}---{$copies}---{$safePages}---{$customName}.{$extension}";

            $file->storeAs('print_queue', $filename, 'local');
        }

        return back()->with('success', 'Files sent to the Librarian successfully!');
    }

    // --- ADMIN ROUTES ---
    public function adminIndex()
    {
        $files = Storage::disk('local')->files('print_queue');
        $printQueue = [];

        foreach ($files as $filepath) {
            $filename = basename($filepath);
            $parts = explode('---', $filename);

            // We now check for 7 parts because we added 'Pages'
            if (count($parts) >= 7) {
                $timestamp = explode('_', $parts[0])[0];
                $printQueue[] = [
                    'filename' => $filename,
                    'time_uploaded' => \Carbon\Carbon::createFromTimestamp($timestamp)->diffForHumans(),
                    'visitor_name' => ucwords(str_replace('-', ' ', $parts[1])),
                    'school_or_barangay' => ucwords(str_replace('-', ' ', $parts[2])),
                    'paper_size' => ucwords(str_replace('-', ' ', $parts[3])),
                    'copies' => $parts[4],
                    'pages' => str_replace('_', ' ', $parts[5]), // Reverse our safe formatting
                    'original_name' => $parts[6],
                ];
            }
        }

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
            'filenames' => 'required|array', // Changed to array for bulk operations
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

        // Loop through all selected files and delete them
        foreach ($request->filenames as $filename) {
            if (Storage::disk('local')->exists('print_queue/' . $filename)) {
                Storage::disk('local')->delete('print_queue/' . $filename);
            }
        }

        return back()->with('success', 'Logged and cleared successfully.');
    }

    // NEW: Function to purely discard files without logging them to the history
    public function destroyQueue(Request $request)
    {
        $request->validate([
            'filenames' => 'required|array'
        ]);

        foreach ($request->filenames as $filename) {
            if (Storage::disk('local')->exists('print_queue/' . $filename)) {
                Storage::disk('local')->delete('print_queue/' . $filename);
            }
        }

        return back()->with('success', 'Files discarded successfully.');
    }

    public function export()
    {
        return Excel::download(new PrintLogsExport, 'gerona_print_logs.csv');
    }
}