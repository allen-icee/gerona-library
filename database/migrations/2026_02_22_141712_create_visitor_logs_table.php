<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visitor_logs', function (Blueprint $table) {
            $table->id();
            $table->string('visitor_name');
            $table->string('address');
            $table->string('school')->nullable(); // Optional
            $table->string('contact_number')->nullable(); // Optional
            $table->string('purpose');
            $table->timestamp('time_in')->useCurrent();
            $table->timestamp('time_out')->nullable();
            $table->longText('signature')->nullable(); // Made Optional
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitor_logs');
    }
};
