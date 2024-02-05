<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Registro;
use Carbon\Carbon;

class RegistroSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ciudades = ['Irun', 'Vitoria-Gasteiz', 'Bilbao', 'Bermeo', 'Donostia/San Sebastian'];

        foreach ($ciudades as $ciudad) {
            $fecha = Carbon::create(2023, 1, 1); // Inicializar la fecha en '2023-01-01'

            for ($i = 0; $i < 365; $i++) {
                Registro::factory()->ciudad($ciudad)->create([
                    'fecha' => $fecha->format('Y-m-d'),
                ]);

                // Incrementar la fecha en un día para la próxima iteración
                $fecha->addDay();
            }
        }
    }
}
