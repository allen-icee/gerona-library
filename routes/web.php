<?php
// routes/web.php
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VisitorLogController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\BookController;
use App\Http\Controllers\BookCopyController;
use App\Http\Controllers\PatronController;
use App\Http\Controllers\CirculationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PrintStationController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\PublicPatronController;
use App\Http\Controllers\PublicCatalogController;

Route::get('/', function () {
    return Inertia::render('Public/Home');
})->name('home');

Route::get('/catalog', [PublicCatalogController::class, 'index'])->name('catalog.index');

Route::get('/get-card', function () {
    return Inertia::render('Public/Register');
})->name('register.index');

Route::get('/print-station', function () {
    return Inertia::render('Public/Print');
})->name('print.index');

Route::post('/register-patron', [PublicPatronController::class, 'store'])
    ->name('register-patron.store')
    ->middleware('throttle:10,1');

Route::post('/print-station/upload', [PrintStationController::class, 'upload'])
    ->name('print-station.upload')
    ->middleware('throttle:10,1');

Route::get('/api/print-station/active-visitors', [PrintStationController::class, 'activeVisitors']);

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/kiosk', function () {
        $activeVisitors = \App\Models\VisitorLog::whereNull('time_out')
            ->orderBy('time_in', 'desc')
            ->get();

        return Inertia::render('Kiosk/Dashboard', [
            'activeVisitors' => $activeVisitors
        ]);
    })->name('kiosk.dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/admin/kiosk/export', [VisitorLogController::class, 'export'])->name('admin.kiosk.export');
    Route::get('/admin/kiosk', [VisitorLogController::class, 'adminIndex'])->name('admin.kiosk.index');
    Route::post('/visitor-logs', [VisitorLogController::class, 'store'])->name('visitor-logs.store');
    Route::patch('/visitor-logs/{visitorLog}/checkout', [VisitorLogController::class, 'checkout'])->name('visitor-logs.checkout');
    Route::post('/visitor-logs/smart-scan', [VisitorLogController::class, 'smartScan'])->name('visitor-logs.smart-scan');

    Route::post('/books/import', [BookController::class, 'import'])->name('books.import');
    Route::get('/books/export', [BookController::class, 'export'])->name('books.export');
    Route::get('/books', [BookController::class, 'index'])->name('books.index');
    Route::post('/books', [BookController::class, 'store'])->name('books.store');
    Route::put('/books/{book}', [BookController::class, 'update'])->name('books.update');
    Route::delete('/books/{book}', [BookController::class, 'destroy'])->name('books.destroy');

    Route::get('/books/{book}/copies', [BookCopyController::class, 'index'])->name('books.copies.index');
    Route::post('/books/{book}/copies', [BookCopyController::class, 'store'])->name('books.copies.store');
    Route::delete('/copies/{copy}', [BookCopyController::class, 'destroy'])->name('copies.destroy');

    Route::get('/patrons/export', [PatronController::class, 'export'])->name('patrons.export');
    Route::get('/patrons', [PatronController::class, 'index'])->name('patrons.index');
    Route::post('/patrons', [PatronController::class, 'store'])->name('patrons.store');
    Route::put('/patrons/{patron}', [PatronController::class, 'update'])->name('patrons.update');
    Route::delete('/patrons/{patron}', [PatronController::class, 'destroy'])->name('patrons.destroy');

    Route::get('/circulation/export', [CirculationController::class, 'export'])->name('circulation.export');
    Route::get('/circulation', [CirculationController::class, 'index'])->name('circulation.index');
    Route::post('/circulation/checkout', [CirculationController::class, 'checkout'])->name('circulation.checkout');
    Route::patch('/circulation/{transaction}/return', [CirculationController::class, 'returnBook'])->name('circulation.return');

    Route::get('/print-services', [PrintStationController::class, 'adminIndex'])->name('print-services.index');
    Route::get('/print-services/export', [PrintStationController::class, 'export'])->name('print-services.export');
    Route::get('/print-queue/{filename}/download', [PrintStationController::class, 'download'])->name('print-queue.download');
    Route::post('/print-queue/log', [PrintStationController::class, 'logAndClear'])->name('print-queue.log');
    Route::delete('/admin/print-station/queue', [PrintStationController::class, 'destroyQueue'])->name('print-queue.destroy');

    Route::get('/donations/export', [DonationController::class, 'export'])->name('donations.export');
    Route::get('/donations', [DonationController::class, 'index'])->name('donations.index');
    Route::post('/donations', [DonationController::class, 'store'])->name('donations.store');
    Route::put('/donations/{donation}', [DonationController::class, 'update'])->name('donations.update');
    Route::delete('/donations/{donation}', [DonationController::class, 'destroy'])->name('donations.destroy');
});

require __DIR__ . '/auth.php';
