<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UnityTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $unityTypes = [
            ['name' => 'Kilogram', 'abbreviation' => 'kg', 'type' => 'weight'],
            ['name' => 'Gram', 'abbreviation' => 'g', 'type' => 'weight'],
            ['name' => 'Liter', 'abbreviation' => 'L', 'type' => 'volume'],
            ['name' => 'Milliliter', 'abbreviation' => 'mL', 'type' => 'volume'],
            ['name' => 'Unit', 'abbreviation' => 'un', 'type' => 'count'],
        ];

        foreach ($unityTypes as $type) {
            \App\Models\UnityType::create($type);
        }
    }
}
