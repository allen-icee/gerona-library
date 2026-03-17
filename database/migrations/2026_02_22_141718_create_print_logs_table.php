<?php
//database\migrations\2026_02_22_141718_create_print_logs_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('print_logs', function (Blueprint $table) {
            $table->id();
            $table->string('visitor_name');
            $table->string('school_or_barangay');
            $table->integer('pages_printed');

            $table->foreignId('logged_by')->constrained('users');

            $table->dateTime('printed_at')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('print_logs');
    }
};
