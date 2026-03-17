<?php
//database\seeders\DatabaseSeeder.php
namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $librarianRole = Role::firstOrCreate(['name' => 'Librarian']);
        $kioskRole = Role::firstOrCreate(['name' => 'Kiosk']);

        $librarian = User::firstOrCreate(
            ['username' => 'librarian'],
            [
                'name' => 'Head Librarian',
                'email' => 'librarian@geronalibrary.gov.ph',
                'password' => bcrypt('Librarian_123'),
            ]
        );
        $librarian->assignRole($librarianRole);

        $kiosk = User::firstOrCreate(
            ['username' => 'kiosk'],
            [
                'name' => 'Front Desk Kiosk',
                'email' => 'kiosk@geronalibrary.gov.ph',
                'password' => bcrypt('Kiosk_123'),
            ]
        );
        $kiosk->assignRole($kioskRole);
    }
}
