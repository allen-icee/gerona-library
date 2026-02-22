<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create the IT / Super Admin Account
        User::factory()->create([
            'name' => 'System Administrator',
            'email' => 'admin@geronalibrary.gov.ph',
            'password' => Hash::make('password123'), // Default password
        ]);

        // Create the Head Librarian Account
        User::factory()->create([
            'name' => 'Head Librarian',
            'email' => 'librarian@geronalibrary.gov.ph',
            'password' => Hash::make('password123'),
        ]);

        $this->command->info('Default Admin and Librarian accounts created successfully!');
    }
}
