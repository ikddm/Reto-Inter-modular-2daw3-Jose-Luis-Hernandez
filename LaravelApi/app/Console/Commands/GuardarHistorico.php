<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\RegistroController;

class GuardarHistorico extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:guardar-historico';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Comando para guardar en la tabla de registros el historico se va utilizar una vez cada 60 minutos';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $registroController = new RegistroController();

        $registroController->insertarHistoricos();

        $this->info('Historicos insertados en la tabla registros');
}
}
