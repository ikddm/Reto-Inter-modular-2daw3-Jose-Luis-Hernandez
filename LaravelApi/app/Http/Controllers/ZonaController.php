<?php

namespace App\Http\Controllers;

use App\Models\Zona;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ZonaController extends Controller
{
    public function insertarMunicipios()
    {
        // Array de códigos de ciudad y municipio
        $codigos = [
            ['codigoProvincia' => '20', 'codigoCiudad' => '20069'],
            ['codigoProvincia' => '01', 'codigoCiudad' => '01059'],
            ['codigoProvincia' => '48', 'codigoCiudad' => '48020'],
            ['codigoProvincia' => '20', 'codigoCiudad' => '20045'],
            ['codigoProvincia' => '48', 'codigoCiudad' => '48017'],
            
            // Añade más códigos según sea necesario
        ];

        foreach ($codigos as $codigo) {
            $codigoProvincia = $codigo['codigoProvincia'];
            $codigoCiudad = $codigo['codigoCiudad'];

            $url = "https://www.el-tiempo.net/api/json/v2/provincias/{$codigoProvincia}/municipios/{$codigoCiudad}";

            // Capturar la respuesta de la solicitud HTTP
            $response = Http::get($url);

            if ($response->successful()) {
                // Procesar los datos y guardarlos en la base de datos
                $data = $response->json();

                Zona::updateOrCreate(
                    ['nombre_ciudad' => $data['municipio']['NOMBRE']], // Clave primaria para buscar el registro
                    [   
                        'latitud' => $data['municipio']['LATITUD_ETRS89_REGCAN95'],
                        'longitud' => $data['municipio']['LONGITUD_ETRS89_REGCAN95'],
                        'estado_cielo' => $data['stateSky']['description'],
                        'temperatura_actual' => $data['temperatura_actual'],
                        'temperatura_max' => $data['temperaturas']['max'],
                        'temperatura_min' => $data['temperaturas']['min'],
                        'humedad' => $data['humedad'],
                        'precipitacion' => $data['precipitacion'],
                        'viento' => $data['viento'],
                        'codigo_provincia' => $codigoProvincia,
                        'codigo_ciudad' => $codigoCiudad // Corregido 'codigo_cuidad' a 'codigo_ciudad'
                    ]
                );
            } else {
                return response()->json(['error' => 'Error al obtener los datos meteorológicos'], 500);
            }
        }

        return response()->json(['mensaje' => 'Datos meteorológicos guardados correctamente']);
    }

    public function obtenerDatos()
    {
        $zonas = Zona::all();

        return response()->json($zonas);
    }

    public function alterarDatos()
    {
        $zonas = Zona::all();

        // Iterar sobre cada zona y realizar la alteración deseada
        foreach ($zonas as $zona) {
            
            $incremento_temperatura = mt_rand(1, 7) / 10; // Genera un valor entre 0.1 y 0.3
            $zona->temperatura_actual += $incremento_temperatura;
        
            
            $incremento_humedad = mt_rand(1, 2) / 100; // Genera un valor entre 0.01 y 0.02 (equivalente al 1% y 2%)
            $zona->humedad *= (1 + $incremento_humedad);
            
      
            $reduccion_precipitacion = mt_rand(1, 3) / 10; // Genera un valor entre 0.1 y 0.3
            $zona->precipitacion *= (1 - $reduccion_precipitacion);
        
            // Guardar los cambios en la base de datos
            $zona->save();
        }
        

        return response()->json(['mensaje' => 'Datos alterados y guardados correctamente']);
    }
}
