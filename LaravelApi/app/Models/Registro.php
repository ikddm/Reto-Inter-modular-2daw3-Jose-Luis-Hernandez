<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registro extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'nombre_ciudad',
        'estado_cielo',
        'temperatura_actual',
        'temperatura_max',
        'temperatura_min',
        'humedad',
        'precipitacion',
        'viento',
        'fecha',
    ];

}