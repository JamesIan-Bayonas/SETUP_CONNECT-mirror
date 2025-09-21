<?php

namespace Database\Seeders;

use App\Enums\UserType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'System Administrator',
            'email' => 'admin@setupconnect.com',
            'password' => Hash::make('admin123'),
            'user_type' => UserType::ADMIN,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
    }
}
