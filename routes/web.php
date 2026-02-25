<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VisitorLogController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Our Custom Controllers
use App\Http\Controllers\BookController;
use App\Http\Controllers\BookCopyController;
use App\Http\Controllers\PatronController;
use App\Http\Controllers\CirculationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PrintStationController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\PublicPatronController;
use App\Http\Controllers\PublicCatalogController;

// ==========================================
// PUBLIC ROUTES (MODAL-DRIVEN)
// ==========================================

// 1. The New Digital Lobby (Welcome Page)
Route::get('/', function () {
    return Inertia::render('Public/Home');
})->name('home');

// 2. Public Search Catalog
Route::get('/catalog', [PublicCatalogController::class, 'index'])->name('catalog.index');

// 3. Public Patron Registration (POST)
Route::post('/register-patron', [PublicPatronController::class, 'store'])->name('register-patron.store');

// 4. Public Print Station (POST)
Route::post('/print-station/upload', [PrintStationController::class, 'upload'])->name('print-station.upload');

// ==========================================
// AUTHENTICATED ADMIN / KIOSK ROUTES
// ==========================================
Route::middleware(['auth', 'verified'])->group(function () {

    // Smart Dashboard Route
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Kiosk Visitor Log Routes
    Route::post('/visitor-logs', [VisitorLogController::class, 'store'])->name('visitor-logs.store');
    Route::patch('/visitor-logs/{visitorLog}/checkout', [VisitorLogController::class, 'checkout'])->name('visitor-logs.checkout');

    // Book Master Catalog Routes
    Route::get('/books', [BookController::class, 'index'])->name('books.index');
    Route::post('/books', [BookController::class, 'store'])->name('books.store');
    Route::put('/books/{book}', [BookController::class, 'update'])->name('books.update');
    Route::delete('/books/{book}', [BookController::class, 'destroy'])->name('books.destroy');

    // Physical Book Copies Routes
    Route::get('/books/{book}/copies', [BookCopyController::class, 'index'])->name('books.copies.index');
    Route::post('/books/{book}/copies', [BookCopyController::class, 'store'])->name('books.copies.store');
    Route::delete('/copies/{copy}', [BookCopyController::class, 'destroy'])->name('copies.destroy');

    // Patron Registry Routes
    Route::get('/patrons', [PatronController::class, 'index'])->name('patrons.index');
    Route::post('/patrons', [PatronController::class, 'store'])->name('patrons.store');
    Route::put('/patrons/{patron}', [PatronController::class, 'update'])->name('patrons.update');
    Route::delete('/patrons/{patron}', [PatronController::class, 'destroy'])->name('patrons.destroy');

    // Circulation Engine Routes
    Route::get('/circulation', [CirculationController::class, 'index'])->name('circulation.index');
    Route::post('/circulation/checkout', [CirculationController::class, 'checkout'])->name('circulation.checkout');
    Route::patch('/circulation/{transaction}/return', [CirculationController::class, 'returnBook'])->name('circulation.return');

    // Admin Print Services Dashboard
    Route::get('/print-services', [PrintStationController::class, 'adminIndex'])->name('print-services.index');
    Route::get('/print-queue/{filename}/download', [PrintStationController::class, 'download'])->name('print-queue.download');
    Route::post('/print-queue/log', [PrintStationController::class, 'logAndClear'])->name('print-queue.log');

    // Global LGU Donations Tracker
    Route::get('/donations', [DonationController::class, 'index'])->name('donations.index');
    Route::post('/donations', [DonationController::class, 'store'])->name('donations.store');
    Route::delete('/donations/{donation}', [DonationController::class, 'destroy'])->name('donations.destroy');
});

require __DIR__ . '/auth.php';
