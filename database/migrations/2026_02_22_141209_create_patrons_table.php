<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('patrons', function (Blueprint $table) {
            $table->id();
            $table->string('library_card_number')->unique();
            $table->string('first_name');
            $table->string('middle_initial', 2)->nullable(); // NEW
            $table->string('last_name');
            $table->string('suffix')->nullable(); // NEW
            $table->enum('type', ['Citizen', 'Student', 'Teacher/LGU Staff']);

            $table->string('email')->unique();
            $table->enum('gender', ['Male', 'Female', 'Other']);
            $table->string('contact_number', 11)->nullable();

            $table->string('province');
            $table->string('municipality');
            $table->string('barangay');
            $table->string('street')->nullable();

            $table->string('school')->nullable();
            $table->enum('status', ['Active', 'Suspended'])->default('Active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patrons');
    }
};