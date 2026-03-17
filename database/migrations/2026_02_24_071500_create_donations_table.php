<?php
//database\migrations\2026_02_24_071500_create_donations_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->string('donator_name');
            $table->string('donator_type')->default('Individual');
            $table->string('donation_category');
            $table->text('description');
            $table->decimal('estimated_value', 10, 2)->nullable();
            $table->date('date_received');

            $table->foreignId('received_by')->constrained('users');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
