<?php
//app\Console\Commands\UpdateOverdueBooks.php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\BorrowTransaction;
use Illuminate\Support\Facades\Log;

class UpdateOverdueBooks extends Command
{
    protected $signature = 'library:update-overdue';
    protected $description = 'Check and update borrowed books that have passed their due date.';

    public function handle()
    {

        $updatedCount = BorrowTransaction::where('status', 'Borrowed')
            ->where('due_at', '<', now())
            ->update(['status' => 'Overdue']);

        $this->info("Successfully updated {$updatedCount} transactions to Overdue.");
        Log::info("Library Auto-Task: {$updatedCount} transactions marked as overdue.");
    }
}
