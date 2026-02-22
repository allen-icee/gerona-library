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
        Schema::create('patrons', function (Blueprint $table) {
            $table->id();
            $table->string('library_card_number')->unique(); // The Patron's QR ID Card
            $table->string('first_name');
            $table->string('last_name');
            $table->string('type'); // e.g., Student, Teacher, General Public
            $table->string('school_or_barangay');
            $table->string('contact_number')->nullable();
            $table->enum('status', ['Active', 'Suspended'])->default('Active'); // Access control
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patrons');
    }
};
