<?php

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

                Zona::create([
                    'nombre_ciudad' => $data['NOMBRE'],
                    'latitud' => $data['LATITUD_ETRS89_REGCAN95'],
                    'longitud' => $data['LONGITUD_ETRS89_REGCAN95'],
                    'estado_cielo' => $data['stateSky']['description'],
                    'temperatura_actual' => $data['temperatura_actual'],
                    'temperatura_max' => $data['temperaturas']['max'],
                    'temperatura_min' => $data['temperaturas']['min'],
                    'humedad' => $data['humedad'],
                    'precipitacion' => $data['precipitacion'],
                    'viento' => $data['viento'],
                ]);
            } else {
                return response()->json(['error' => 'Error al obtener los datos meteorológicos'], 500);
            }
        }

        return response()->json(['mensaje' => 'Datos meteorológicos guardados correctamente']);
    }
}
