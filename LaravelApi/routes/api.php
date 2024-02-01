<?php

use App\Http\Controllers\RegistroController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ZonaController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('insertar-municipios', [ZonaController::class, 'insertarMunicipios']);

Route::get('obtener-datos', [ZonaController::class, 'obtenerDatos']);

Route::get('insertar-historicos', [RegistroController::class, 'insertarHistoricos']);

