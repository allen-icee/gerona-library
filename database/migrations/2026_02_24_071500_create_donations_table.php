<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->string('donator_name');
            $table->string('donator_type')->default('Individual'); // e.g., Individual, NGO, LGU Official
            $table->string('donation_category'); // e.g., Books, Equipment, Furniture, Cash
            $table->text('description'); // e.g., "5 Dell Desktop Computers"
            $table->decimal('estimated_value', 10, 2)->nullable(); // Useful for LGU asset auditing
            $table->date('date_received');

            // Accountability: Which staff member logged this?
            $table->foreignId('received_by')->constrained('users');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
