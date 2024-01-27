<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Zona extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre_cuidad',
        'latitud',
        'longitud',
        'estado_cielo',
        'temperatura_actual',
        'temperatura_max',
        'temperatura_min',
        'humedad',
        'precipitacion',
        'viento',
        'codigo_cuidad',
        'codigo_provincia',
    ];
    
    
}

