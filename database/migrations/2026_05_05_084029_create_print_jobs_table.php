<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('print_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('visitor_name');
            $table->string('school_or_barangay')->nullable();
            $table->string('custom_name');
            $table->integer('copies')->default(1);
            $table->string('paper_size');
            $table->string('pages')->default('All');
            $table->string('file_path');
            $table->string('original_extension');
            $table->enum('status', ['Pending', 'Printed', 'Discarded'])->default('Pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('print_jobs');
    }
};
