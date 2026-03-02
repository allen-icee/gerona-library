<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patrons', function (Blueprint $table) {
            $table->id();
            $table->string('library_card_number')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->enum('type', ['Citizen', 'Student', 'Teacher/LGU Staff']);

            // New Demographic & Contact Info
            $table->string('email')->unique();
            $table->enum('gender', ['Male', 'Female', 'Other']);
            $table->string('contact_number')->nullable();

            // Address Fields
            $table->string('province');
            $table->string('municipality');
            $table->string('barangay');
            $table->string('street')->nullable();

            // Conditional Field
            $table->string('school')->nullable(); // Only filled if type is 'Student'

            $table->enum('status', ['Active', 'Suspended'])->default('Active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patrons');
    }
};
