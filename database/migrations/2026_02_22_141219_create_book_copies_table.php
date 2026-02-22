<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('book_copies', function (Blueprint $table) {
            $table->id();
            // This links the copy to the master book record
            $table->foreignId('book_id')->constrained()->cascadeOnDelete();

            $table->string('accession_number')->unique(); // The QR Code / Barcode
            $table->string('shelf_location')->nullable();
            $table->enum('status', ['Available', 'Borrowed', 'Lost', 'Damaged', 'Maintenance'])->default('Available');

            // Donation tracking (as discussed)
            $table->date('date_acquired')->nullable();
            $table->string('source')->nullable(); // e.g., Purchased, LGU Grant, Donated
            $table->string('donator_name')->nullable();
            $table->text('remarks')->nullable();

            // Future-proofing for multi-branch scaling
            $table->unsignedBigInteger('library_id')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_copies');
    }
};
