<?php

namespace App\Http\Controllers;

use App\Models\Zona;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ZonaController extends Controller
{
    public function obtenerZonas(){
        $zonas = Zona::all();
        return response()->json($zonas);
    }
}
