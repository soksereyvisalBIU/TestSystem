<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory(1)->create();

        User::factory()->create([
            'name' => 'superadmin',
            'email' => 'superadmin@example.com',
            'password' => 123123123,
            'role' => 3,
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'remember_token' => null,
        ]);
        User::factory()->create([
            'name' => 'teacher',
            'email' => 'teacher@example.com',
            'password' => 123123123,
            'role' => 2,
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'remember_token' => null,
        ]);
        User::factory()->create([
            'name' => 'student',
            'email' => 'student@example.com',
            'password' => 123123123,
            'role' => 1,
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'remember_token' => null,
        ]);

        // User::firstOrCreate(
        //     ['email' => 'test@example.com'],
        //     [
        //         'name' => 'Test User',
        //         'password' => 'password',
        //         'email_verified_at' => now(),
        //     ]
        // );
    }
}
