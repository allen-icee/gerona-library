<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create the Official Access Roles (Just Two Now!)
        $librarianRole = Role::firstOrCreate(['name' => 'Librarian']);
        $kioskRole = Role::firstOrCreate(['name' => 'Kiosk']);

        // 2. Create the Master Librarian Account
        $librarian = User::firstOrCreate(
            ['username' => 'librarian'], // <-- New official username
            [
                'name' => 'Head Librarian',
                'email' => 'librarian@geronalibrary.gov.ph',
                'password' => bcrypt('Librarian@2026!'),
            ]
        );
        $librarian->assignRole($librarianRole);

        // 3. Create the locked-down Kiosk Account
        $kiosk = User::firstOrCreate(
            ['username' => 'kiosk'],
            [
                'name' => 'Front Desk Kiosk',
                'email' => 'kiosk@geronalibrary.gov.ph',
                'password' => bcrypt('Kiosk@2026!'),
            ]
        );
        $kiosk->assignRole($kioskRole);
    }
}
