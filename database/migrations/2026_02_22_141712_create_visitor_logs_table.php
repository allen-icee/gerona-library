<?php
//database\migrations\2026_02_22_141712_create_visitor_logs_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('visitor_logs', function (Blueprint $table) {
            $table->id();
            $table->string('visitor_name');
            $table->string('address');
            $table->string('school')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('purpose');
            $table->timestamp('time_in')->useCurrent();
            $table->timestamp('time_out')->nullable();
            $table->longText('signature')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitor_logs');
    }
};
