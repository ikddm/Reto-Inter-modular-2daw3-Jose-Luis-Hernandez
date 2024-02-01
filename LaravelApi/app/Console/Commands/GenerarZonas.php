<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\ZonaController;

class GenerarZonas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generar-zonas';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
              // Instancia el controlador
              $zonaController = new ZonaController();

              // Llama al método alterarDatos()
              $zonaController->insertarMunicipios();
      
              $this->info('Municipios importados y mediciones reales tomadas');
    }
}
