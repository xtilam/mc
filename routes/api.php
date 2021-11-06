<?php

require_once __DIR__ . '/../app/Common/MessageAPI.php';

use App\Http\Controllers\API\ArtisanController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CommandController;
use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/auth/verification', [AuthController::class, 'verification']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);

Route::middleware('jwt')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});

Route::get('/test', function () {
    return response()->json(['this is content']);
});

// auto remove when deploy
Route::get('/artisan', [ArtisanController::class, 'index']);
Route::get('/artisan/remove', [ArtisanController::class, 'removeArtisan']);
