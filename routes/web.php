<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VisitorLogController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\VisitorLog;
use App\Http\Controllers\BookController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {

    // Smart Dashboard Route based on Spatie Roles
    Route::get('/dashboard', function (Request $request) {

        // 1. If it is the Kiosk, fetch active visitors and render the Kiosk folder
        if ($request->user()->hasRole('Kiosk')) {
            $activeVisitors = VisitorLog::whereNull('time_out')
                ->whereDate('time_in', today())
                ->orderBy('time_in', 'desc')
                ->get(['id', 'visitor_name', 'address', 'time_in']);

            return Inertia::render('Kiosk/Dashboard', [
                'activeVisitors' => $activeVisitors
            ]);
        }

        // 2. If it is Super Admin or Librarian, render the Admin folder
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Kiosk Visitor Log Routes
    Route::post('/visitor-logs', [VisitorLogController::class, 'store'])->name('visitor-logs.store');
    Route::patch('/visitor-logs/{visitorLog}/checkout', [VisitorLogController::class, 'checkout'])->name('visitor-logs.checkout');

    Route::get('/books', [BookController::class, 'index'])->name('books.index');
    Route::post('/books', [BookController::class, 'store'])->name('books.store'); // <-- Add this
});

require __DIR__ . '/auth.php';
