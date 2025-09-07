<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Artisan;

class routes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'generate:routes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate routes for the application with wayfinding support';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting route generation...');

        $this->info('Generating English routes...');

        $this->info(App::getLocale());
        Artisan::call('wayfinder:generate', ['--env' => 'example']);
        $this->info(Artisan::output());
        $this->info('English routes generated successfully.');

        $this->info('Returning to default locale...');


        $this->info('Routes generated successfully.');
        return Command::SUCCESS;
    }
}
