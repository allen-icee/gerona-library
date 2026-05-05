<?php
//app\Http\Controllers\PublicPatronController.php
namespace App\Http\Controllers;

use App\Models\Patron;
use App\Http\Requests\StorePatronRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\LibraryCardGenerated;
use App\Services\LibraryCardService;
use Illuminate\Support\Facades\DB;

class PublicPatronController extends Controller
{
    protected $libraryCardService;

    public function __construct(LibraryCardService $libraryCardService)
    {
        $this->libraryCardService = $libraryCardService;
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
            $validated['status'] = 'Active';
            return Patron::create($validated);
        });

        Mail::to($patron->email)->queue(new LibraryCardGenerated($patron));

        return back()->with([
            'patron' => $patron,
            'success' => 'Registration successful!'
        ]);
    }
}
