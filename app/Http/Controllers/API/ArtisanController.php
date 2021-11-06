<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Support\Facades\Artisan;
use Symfony\Component\Console\Output\BufferedOutput;

class ArtisanController extends Controller
{
    const password = "thanhbotay007thanhbotay008thanhbotay009";
    public function index(Request $req)
    {
        try {
            if (defined('STDIN')) {
                define('STDIN', fopen("php://stdin", "r"));
            }

            if ($req->password === static::password) {
                $command = $req->command;
                $output = new BufferedOutput();
                Artisan::call($command, [], $output);
                return messageAPI('ok', $output->fetch());
            }
            throw new Exception('wrong password');
        } catch (\Throwable $th) {
            return messageAPI('exception', $th);
        }
    }

    public function removeArtisan()
    {
        if (env('APP_ENV') === 'local') {
            return messageAPI('error', 'not support for APP_ENV="local"');
        }

        $apiDir = __DIR__ . '/../../../../routes/api.php';
        $contents = file_get_contents($apiDir);
        $contents = preg_replace('/.*?ArtisanController.*?\n/', '', $contents);
        file_put_contents($apiDir, $contents);

        return messageAPI('ok', 'success');
    }
}
