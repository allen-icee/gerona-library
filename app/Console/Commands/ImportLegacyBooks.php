<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Book;
use App\Models\BookCopy;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ImportLegacyBooks extends Command
{
    // The command signature requires the filename as an argument
    protected $signature = 'import:legacy-books {filename}';
    protected $description = 'Safely import legacy Excel/CSV inventory into normalized tables';

    public function handle()
    {
        $filename = $this->argument('filename');
        $path = storage_path("app/" . $filename);

        if (!file_exists($path)) {
            $this->error("File not found! Please place {$filename} inside the storage/app/ folder.");
            return;
        }

        $this->info("Reading {$filename}...");

        $file = fopen($path, 'r');

        // Read and trim headers to remove accidental spaces
        $headers = array_map('trim', fgetcsv($file));
        $headerCount = count($headers);

        $rowCount = count(file($path)) - 1;
        $bar = $this->output->createProgressBar($rowCount);
        $bar->start();

        DB::beginTransaction();

        try {
            while (($row = fgetcsv($file)) !== false) {

                // Skip completely empty rows at the bottom of the Excel file
                if (empty(array_filter($row))) {
                    $bar->advance();
                    continue;
                }

                // CLEAN THE DIRTY CSV ROW:
                // If Excel exported too few or too many columns, we force it to match the header length
                $currentRowCount = count($row);
                if ($currentRowCount < $headerCount) {
                    $row = array_pad($row, $headerCount, null); // Pad with nulls
                } elseif ($currentRowCount > $headerCount) {
                    $row = array_slice($row, 0, $headerCount); // Chop off extra invisible columns
                }

                // Now it is 100% safe to combine
                $data = array_combine($headers, $row);

                // 1. Find or Create the Master Book Record
                $book = Book::firstOrCreate(
                    [
                        'title' => trim($data['Title'] ?? 'Unknown Title'),
                        'author' => trim($data['Author'] ?? 'Unknown Author'),
                    ],
                    [
                        'isbn' => $data['ISBN'] ?? null,
                        'publisher' => $data['Publisher'] ?? null,
                        'year_published' => $data['Year Published'] ?? null,
                        'category' => $data['Category'] ?? null,
                        'language' => $data['Language'] ?? 'English',
                    ]
                );

                // 2. Insert the specific Physical Copy
                $accessionNo = trim($data['Accession No.'] ?? '');

                if (!empty($accessionNo) && !BookCopy::where('accession_number', $accessionNo)->exists()) {

                    // Safely parse Date Acquired
                    $dateAcquired = null;
                    if (!empty($data['Date Acquired'])) {
                        try {
                            $dateAcquired = Carbon::parse($data['Date Acquired'])->format('Y-m-d');
                        } catch (\Exception $e) {
                            $dateAcquired = null; // Ignore badly formatted Excel dates
                        }
                    }

                    BookCopy::create([
                        'book_id' => $book->id,
                        'accession_number' => $accessionNo,
                        'shelf_location' => $data['Shelf Location'] ?? null,
                        'status' => $data['Status'] ?? 'Available',
                        'date_acquired' => $dateAcquired,
                        'remarks' => $data['Remarks'] ?? null,
                        'library_id' => 1
                    ]);
                }

                $bar->advance();
            }

            DB::commit();
            $bar->finish();
            $this->newLine(2);
            $this->info('Legacy library inventory imported successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("\nImport failed! Database rolled back. Error: " . $e->getMessage());
        }

        fclose($file);
    }
}
