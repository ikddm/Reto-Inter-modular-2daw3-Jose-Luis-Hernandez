<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Zona extends Model
{
    use HasFactory;
    public $timestamps = false;

    protected $fillable = [
        'nombre_ciudad',
        'latitud',
        'longitud',
        'estado_cielo',
        'temperatura_actual',
        'temperatura_max',
        'temperatura_min',
        'humedad',
        'precipitacion',
        'viento',
        'codigo_ciudad',
        'codigo_provincia',
    ];
}

