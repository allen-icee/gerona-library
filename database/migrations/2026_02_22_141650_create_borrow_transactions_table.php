<?php
//database\migrations\2026_02_22_141650_create_borrow_transactions_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('borrow_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patron_id')->constrained()->cascadeOnDelete();
            $table->foreignId('book_copy_id')->constrained()->cascadeOnDelete();

            $table->foreignId('issued_by')->constrained('users');
            $table->foreignId('received_by')->nullable()->constrained('users');

            $table->dateTime('borrowed_at');
            $table->dateTime('due_at');
            $table->dateTime('returned_at')->nullable();

            $table->decimal('fine_amount', 8, 2)->default(0.00);

            $table->enum('status', ['Borrowed', 'Returned', 'Overdue', 'Lost'])->default('Borrowed');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('borrow_transactions');
    }
};
