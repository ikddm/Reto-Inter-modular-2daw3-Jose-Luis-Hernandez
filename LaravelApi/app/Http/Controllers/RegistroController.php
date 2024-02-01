<?php

namespace App\Http\Controllers;

use App\Models\Registro;
use App\Models\Zona;
use Illuminate\Http\Request;
use Carbon\Carbon;

class RegistroController extends Controller
{
    // Otras funciones del controlador...

    public function insertarHistoricos()
    {
        $zonas = Zona::all();

        foreach ($zonas as $zona) {
            // Crear un nuevo registro en la tabla de históricos
            Registro::create([
                'nombre_ciudad' => $zona->nombre_ciudad,
                'estado_cielo' => $zona->estado_cielo,
                'precipitacion' => $zona->precipitacion,
                'humedad' => $zona->humedad,
                'temperatura_actual' => $zona->temperatura_actual,
                'temperatura_min' => $zona->temperatura_min,
                'temperatura_max' => $zona->temperatura_max,
                'viento' => $zona->viento,
                'fecha' => Carbon::now(), // Utilizar Carbon para obtener la fecha actual
            ]);
        }
        return response()->json(['mensaje' => 'Datos históricos guardados correctamente']);
    }
}
