<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class RegistroFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $ciudades = ['Irun', 'Vitoria-Gasteiz', 'Bilbao', 'Bermeo', 'Donostia/San Sebastian'];
        $estado_cielo = ['Nuboso', 'Soleado', 'Nublado'];

        // Generar una fecha aleatoria dentro de un rango
        $fecha = $this->faker->dateTimeBetween('2023-01-01', '2023-12-31')->format('Y-m-d');

        return [
            'nombre_ciudad' => $this->faker->randomElement($ciudades),
            'estado_cielo' => $this->faker->randomElement($estado_cielo),
            'precipitacion' => $this->faker->randomFloat(2, 0, 10),
            'humedad' => $this->faker->randomFloat(2, 60, 90),
            'temperatura_actual' => $this->faker->randomFloat(2, 5, 25),
            'temperatura_min' => $this->faker->randomFloat(2, -5, 15),
            'temperatura_max' => $this->faker->randomFloat(2, 10, 30),
            'viento' => $this->faker->randomFloat(2, 5, 20),
            'fecha' => $fecha,
        ];
    }

    /**
     * Define the state of the factory.
     *
     * @param string $ciudad
     * @return $this
     */
    public function ciudad(string $ciudad): RegistroFactory
    {
        return $this->state(function (array $attributes) use ($ciudad) {
            return ['nombre_ciudad' => $ciudad];
        });
    }
}
