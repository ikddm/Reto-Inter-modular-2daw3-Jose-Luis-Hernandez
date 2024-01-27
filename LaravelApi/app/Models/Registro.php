<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registro extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre_cuidad',
        'estado_cielo',
        'temperatura_actual',
        'temperatura_max',
        'temperatura_min',
        'humedad',
        'precipitacion',
        'viento',
        'fecha',
    ];

    // Método boot para asignar la fecha actual antes de insertar
    protected static function boot()
    {
        parent::boot();

        // Se ejecuta antes de que se inserte un nuevo registro en la base de datos
        static::creating(function ($registro) {
            $registro->fecha = now(); // Asignar la fecha actual a la columna 'fecha'
        });
    }
}