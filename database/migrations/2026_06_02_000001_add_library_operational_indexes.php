<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->index('isbn', 'books_isbn_index');
            $table->index(['title', 'author'], 'books_title_author_index');
        });

        Schema::table('book_copies', function (Blueprint $table) {
            $table->index(['book_id', 'status'], 'book_copies_book_status_index');
            $table->index('status', 'book_copies_status_index');
        });

        Schema::table('borrow_transactions', function (Blueprint $table) {
            $table->index(['status', 'borrowed_at'], 'borrow_transactions_status_borrowed_index');
            $table->index('due_at', 'borrow_transactions_due_at_index');
        });

        Schema::table('visitor_logs', function (Blueprint $table) {
            $table->index(['time_out', 'time_in'], 'visitor_logs_checkout_time_index');
            $table->index('patron_id', 'visitor_logs_patron_id_index');
        });

        Schema::table('donations', function (Blueprint $table) {
            $table->index('date_received', 'donations_date_received_index');
            $table->index('donation_category', 'donations_category_index');
        });
    }

    public function down(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            $table->dropIndex('donations_date_received_index');
            $table->dropIndex('donations_category_index');
        });

        Schema::table('visitor_logs', function (Blueprint $table) {
            $table->dropIndex('visitor_logs_checkout_time_index');
            $table->dropIndex('visitor_logs_patron_id_index');
        });

        Schema::table('borrow_transactions', function (Blueprint $table) {
            $table->dropIndex('borrow_transactions_status_borrowed_index');
            $table->dropIndex('borrow_transactions_due_at_index');
        });

        Schema::table('book_copies', function (Blueprint $table) {
            $table->dropIndex('book_copies_book_status_index');
            $table->dropIndex('book_copies_status_index');
        });

        Schema::table('books', function (Blueprint $table) {
            $table->dropIndex('books_isbn_index');
            $table->dropIndex('books_title_author_index');
        });
    }
};
