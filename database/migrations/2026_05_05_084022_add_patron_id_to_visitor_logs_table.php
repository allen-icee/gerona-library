<?php
//database\migrations\2026_05_05_084022_add_patron_id_to_visitor_logs_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('visitor_logs', function (Blueprint $table) {
            $table->foreignId('patron_id')->nullable()->constrained()->nullOnDelete()->after('id');
        });
    }

    public function down(): void
    {
        Schema::table('visitor_logs', function (Blueprint $table) {
            $table->dropForeign(['patron_id']);
            $table->dropColumn('patron_id');
        });
    }
};
