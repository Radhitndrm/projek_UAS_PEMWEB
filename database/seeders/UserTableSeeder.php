<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $role = Role::where('name', 'super-admin')->first();

        $user = User::create([
            'name' => 'Administrator',
            'username' => 'admin',
            'email' => 'admin@dev.com',
            'password' => bcrypt('password'),
        ]);

        $user->assignRole($role);
    }
}
