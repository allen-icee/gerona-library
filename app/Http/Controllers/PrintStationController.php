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
        return Inertia::render('Public/PrintStation');
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
        ]);

        $safeName = Str::slug($request->visitor_name);
        $safeSchool = Str::slug($request->school_or_barangay ?? 'Guest');

        foreach ($request->documents as $doc) {
            $file = $doc['file'];
            $customName = Str::slug($doc['custom_name']);
            $copies = $doc['copies'];
            $safePaper = Str::slug($doc['paper_size']);

            $extension = $file->getClientOriginalExtension();
            $uniqueId = uniqid();

            // Format: timestamp_uniqid---Name---School---Paper---Copies---CustomName.ext
            $filename = time() . "_{$uniqueId}---{$safeName}---{$safeSchool}---{$safePaper}---{$copies}---{$customName}.{$extension}";

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

            if (count($parts) >= 6) {
                $timestamp = explode('_', $parts[0])[0];
                $printQueue[] = [
                    'filename' => $filename,
                    'time_uploaded' => \Carbon\Carbon::createFromTimestamp($timestamp)->diffForHumans(),
                    'visitor_name' => ucwords(str_replace('-', ' ', $parts[1])),
                    'school_or_barangay' => ucwords(str_replace('-', ' ', $parts[2])),
                    'paper_size' => ucwords(str_replace('-', ' ', $parts[3])),
                    'copies' => $parts[4],
                    'original_name' => $parts[5], // This now represents the user's custom name
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
    public function export()
    {
        return Excel::download(new PrintLogsExport, 'gerona_print_logs.csv');
    }
}
