<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'Dmitry', 'email' => 'dmitry@test.com'],
            ['name' => 'Alice',  'email' => 'alice@test.com'],
            ['name' => 'Bob',    'email' => 'bob@test.com'],
        ];

        foreach ($users as $u) {
            User::updateOrCreate(
                ['email' => $u['email']],
                [
                    'name' => $u['name'],
                    'password' => Hash::make('password'),
                ]
            );
        }
    }
}
