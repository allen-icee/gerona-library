<?php

namespace App\Http\Controllers;

use App\Models\PrintLog;
use App\Models\PrintJob;
use App\Models\VisitorLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\PrintLogsExport;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class PrintStationController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            // Protect only the librarian management routes
            new Middleware('role:Librarian', only: ['adminIndex', 'download', 'logAndClear', 'destroyQueue', 'export']),
        ];
    }

    public function activeVisitors()
    {
        return response()->json(
            VisitorLog::whereNull('time_out')
                ->select('id', 'visitor_name', 'school', 'address')
                ->orderBy('time_in', 'desc')
                ->get()
        );
    }

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
            'documents.*.file' => 'required|file|max:204800',
            'documents.*.custom_name' => 'required|string|max:255',
            'documents.*.copies' => 'required|integer|min:1',
            'documents.*.paper_size' => 'required|string',
            'documents.*.pages' => 'required|string',
        ]);

        foreach ($request->documents as $doc) {
            $file = $doc['file'];
            $extension = $file->getClientOriginalExtension();

            // Clean, non-fragile filename
            $safeFileName = time() . '_' . Str::random(10) . '.' . $extension;
            $path = $file->storeAs('print_queue', $safeFileName, 'local');

            PrintJob::create([
                'visitor_name' => $request->visitor_name,
                'school_or_barangay' => $request->school_or_barangay ?? 'Guest',
                'custom_name' => $doc['custom_name'],
                'copies' => $doc['copies'],
                'paper_size' => $doc['paper_size'],
                'pages' => empty($doc['pages']) ? 'All' : $doc['pages'],
                'file_path' => $path,
                'original_extension' => $extension,
                'status' => 'Pending'
            ]);
        }

        return back()->with('success', 'Files sent to the Librarian successfully!');
    }

    public function adminIndex()
    {
        // Safely fetch queue from the database
        $printQueue = PrintJob::where('status', 'Pending')->latest()->get()->map(function ($job) {
            return [
                'id' => $job->id,
                'filename' => $job->id, // Passing ID instead of raw filename for the download route
                'time_uploaded' => $job->created_at->diffForHumans(),
                'visitor_name' => $job->visitor_name,
                'school_or_barangay' => $job->school_or_barangay,
                'paper_size' => $job->paper_size,
                'copies' => $job->copies,
                'pages' => $job->pages,
                'original_name' => $job->custom_name,
            ];
        });

        $printLogs = PrintLog::with('logger:id,name')->latest()->paginate(15);

        return Inertia::render('Admin/PrintStation/Index', [
            'printQueue' => $printQueue,
            'printLogs' => $printLogs
        ]);
    }

    public function download($id)
    {
        $job = PrintJob::findOrFail($id);

        if (Storage::disk('local')->exists($job->file_path)) {
            return response()->download(Storage::disk('local')->path($job->file_path), $job->custom_name . '.' . $job->original_extension);
        }

        return back()->with('error', 'File not found on server.');
    }

    public function logAndClear(Request $request)
    {
        $request->validate([
            'job_ids' => 'required|array', // Validates against DB IDs
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

        foreach ($request->job_ids as $id) {
            $job = PrintJob::find($id);
            if ($job) {
                if (Storage::disk('local')->exists($job->file_path)) {
                    Storage::disk('local')->delete($job->file_path);
                }
                $job->update(['status' => 'Printed']);
            }
        }

        return back()->with('success', 'Logged and cleared successfully.');
    }

    public function destroyQueue(Request $request)
    {
        $request->validate([
            'job_ids' => 'required|array'
        ]);

        foreach ($request->job_ids as $id) {
            $job = PrintJob::find($id);
            if ($job) {
                if (Storage::disk('local')->exists($job->file_path)) {
                    Storage::disk('local')->delete($job->file_path);
                }
                $job->update(['status' => 'Discarded']);
            }
        }

        return back()->with('success', 'Files discarded successfully.');
    }

    public function export()
    {
        return Excel::download(new PrintLogsExport, 'gerona_print_logs.csv');
    }
}
