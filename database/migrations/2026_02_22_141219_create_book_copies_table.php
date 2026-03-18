<?php
//database\migrations\2026_02_22_141219_create_book_copies_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('book_copies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained()->cascadeOnDelete();

            $table->string('accession_number')->unique();
            $table->string('shelf_location')->nullable();
            $table->enum('status', ['Available', 'Borrowed', 'Lost', 'Damaged', 'Maintenance'])->default('Available');

            $table->date('date_acquired')->nullable();
            $table->string('source')->nullable();
            $table->string('donator_name')->nullable();
            $table->text('remarks')->nullable();
            $table->softDeletes();
            $table->unsignedBigInteger('library_id')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('book_copies');
    }
};
