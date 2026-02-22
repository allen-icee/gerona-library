<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create the Roles
        $adminRole = Role::firstOrCreate(['name' => 'Super Admin']);
        $librarianRole = Role::firstOrCreate(['name' => 'Librarian']);
        $kioskRole = Role::firstOrCreate(['name' => 'Kiosk']);

        // 2. Create the IT / Super Admin Account
        $admin = User::firstOrCreate(
            ['email' => 'admin@geronalibrary.gov.ph'],
            [
                'name' => 'System Administrator',
                'password' => Hash::make('password123'),
            ]
        );
        $admin->assignRole($adminRole);

        // 3. Create the Head Librarian Account
        $librarian = User::firstOrCreate(
            ['email' => 'librarian@geronalibrary.gov.ph'],
            [
                'name' => 'Head Librarian',
                'password' => Hash::make('password123'),
            ]
        );
        $librarian->assignRole($librarianRole);

        // 4. Create the Kiosk Front Desk Account
        $kiosk = User::firstOrCreate(
            ['email' => 'kiosk@geronalibrary.gov.ph'],
            [
                'name' => 'Entrance Kiosk',
                'password' => Hash::make('password123'),
            ]
        );
        $kiosk->assignRole($kioskRole);

        $this->command->info('Roles and default accounts created successfully!');
    }
}
