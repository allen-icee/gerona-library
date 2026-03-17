<?php
//app\Console\Commands\ImportLegacyBooks.php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Book;
use App\Models\BookCopy;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ImportLegacyBooks extends Command
{
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

        $headers = array_map('trim', fgetcsv($file));
        $headerCount = count($headers);

        $rowCount = count(file($path)) - 1;
        $bar = $this->output->createProgressBar($rowCount);
        $bar->start();

        DB::beginTransaction();

        try {
            while (($row = fgetcsv($file)) !== false) {

                if (empty(array_filter($row))) {
                    $bar->advance();
                    continue;
                }

                $currentRowCount = count($row);
                if ($currentRowCount < $headerCount) {
                    $row = array_pad($row, $headerCount, null);
                } elseif ($currentRowCount > $headerCount) {
                    $row = array_slice($row, 0, $headerCount);
                }

                $data = array_combine($headers, $row);

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

                $accessionNo = trim($data['Accession No.'] ?? '');

                if (!empty($accessionNo) && !BookCopy::where('accession_number', $accessionNo)->exists()) {

                    $dateAcquired = null;
                    if (!empty($data['Date Acquired'])) {
                        try {
                            $dateAcquired = Carbon::parse($data['Date Acquired'])->format('Y-m-d');
                        } catch (\Exception $e) {
                            $dateAcquired = null;
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
