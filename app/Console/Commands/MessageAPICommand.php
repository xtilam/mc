<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use stdClass;

class MessageAPICommand extends Command
{
    protected $path_file_config = __DIR__ . '/../../../react/config/api-message.ts';

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mapi';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        require_once __DIR__ . '/../../Common/MessageAPI.php';

        $config = messageAPI(true);

        $obj = new stdClass();

        function recursive($dataArray, $obj)
        {
            foreach ($dataArray as $key => $value) {
                if (isset($value[0]) && is_int($value[0])) {
                    $obj->{$key} = $value[0];
                    continue;
                }
                $obj->{$key} = new stdClass();
                recursive($value, $obj->{$key});
            }
        };

        recursive($config, $obj);

        file_put_contents($this->path_file_config, 'export const messageAPI = ' . json_encode($obj));
    }
}
