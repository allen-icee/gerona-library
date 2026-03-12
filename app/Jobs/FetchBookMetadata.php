<?php

namespace App\Jobs;

use App\Models\Book;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;

class FetchBookMetadata implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $book;

    public function __construct(Book $book)
    {
        $this->book = $book;
    }

    public function handle(): void
    {
        if (!$this->book->isbn)
            return;

        $isbn = $this->book->isbn;

        try {
            // 1. Try Google Books
            $google = Http::timeout(5)->get("https://www.googleapis.com/books/v1/volumes?q=isbn:{$isbn}");

            if ($google->successful() && isset($google['items'][0])) {
                $info = $google['items'][0]['volumeInfo'];
                $this->book->update([
                    'description' => $info['description'] ?? $this->book->description,
                    'cover_url' => isset($info['imageLinks']['thumbnail'])
                        ? str_replace('http://', 'https://', $info['imageLinks']['thumbnail'])
                        : $this->book->cover_url
                ]);
                return; // Stop here if Google succeeded
            }

            // 2. Try OpenLibrary if Google Failed
            $open = Http::timeout(5)->get("https://openlibrary.org/api/books?bibkeys=ISBN:{$isbn}&format=json&jscmd=data");

            if ($open->successful()) {
                $data = $open->json();
                if (isset($data["ISBN:$isbn"])) {
                    $bookData = $data["ISBN:$isbn"];
                    $this->book->update([
                        'description' => $bookData['notes'] ?? $this->book->description,
                        'cover_url' => isset($bookData['cover'])
                            ? ($bookData['cover']['large'] ?? $bookData['cover']['medium'] ?? $bookData['cover']['small'])
                            : $this->book->cover_url
                    ]);
                    return;
                }
            }
        } catch (\Exception $e) {
            // Ignore network timeouts so the queue doesn't crash
        }

        // 3. Final Fallback if both APIs fail
        if (!$this->book->cover_url) {
            $this->book->update([
                'cover_url' => "https://covers.openlibrary.org/b/isbn/{$isbn}-L.jpg?default=false"
            ]);
        }
    }
}