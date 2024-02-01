<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\ZonaController;

class GenerarDatosAleatorios extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generar-datos-aleatorios';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Rellenamos la base de datos';

    /**
     * Execute the console command.
     */
    public function handle()
    {
           // Instancia el controlador
           $zonaController = new ZonaController();

           // Llama al método alterarDatos()
           $zonaController->alterarDatos();
   
           $this->info('Datos de zonas generados correctamente.');

    }
}
