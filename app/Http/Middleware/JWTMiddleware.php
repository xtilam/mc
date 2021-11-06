<?php

namespace App\Http\Middleware;

use App\Common\JAuth;
use App\Common\JWT;
use Closure;
use Exception;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class JWTMiddleware
{

    protected $maxDaysTokenExpired = 5;
    protected $maxDaysClean = 1;

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $this->clearLoginSession();

        try {
            $jwt = Session::get('Authorization') ?? $request->header('Authorization');
            if (!$jwt) return messageAPI('auth.miss_token');

            $jwtDecode = JWT::claimToken($jwt);
            if (!$jwtDecode) return messageAPI('auth.token_invalid');

            $userId = $jwtDecode->id;
            $loginSessionId = $jwtDecode->id_session;

            $ip = Cache::get('ls_' . $loginSessionId . '_u_' . $userId . '_ll');
            $lastTimeLogin = Cache::get('ls_' . $loginSessionId . '_u_' . $userId . '_ll');

            $removeLoginSession = function () use ($loginSessionId, $userId, $ip) {
                Cache::forget('ls_' . $loginSessionId . '_u_' . $userId . '_ip');
                Cache::forget('ls_' . $loginSessionId . '_u_' . $userId . '_ll');
            };

            if ($lastTimeLogin) {
                //check ip
                if (!$ip || $ip !== $request->ip()) {
                    $removeLoginSession();
                    return messageAPI('auth.ip_invalid');
                }

                $isExpired = Carbon::now()->greaterThan(
                    Carbon::createFromTimestamp($lastTimeLogin)->addDays($this->maxDaysTokenExpired)
                );

                if ($isExpired) {
                    $removeLoginSession();
                    messageAPI('auth.token_expired');
                }

                JAuth::$user = $jwtDecode;
                return $next($request);
            }
            return messageAPI('auth.token_expired');
        } catch (Exception $e) {
            return messageAPI('exception', $e);
        }
    }

    public function clearLoginSession()
    {
        // $nextCleanServer = Cache::get('nextCleanServer');
        $nextCleanServer = null;
        if ($nextCleanServer && Carbon::createFromTimestamp($nextCleanServer)->greaterThan(Carbon::now())) return;

        $now = Carbon::now();
        Cache::forever('nextCleanServer', $now->addDays($this->maxDaysClean)->timestamp);

        $table = DB::table('user_login_session');

        $table->get()->each(function ($login_session) use ($table, $now) {
            $lastTimeLogin = Cache::get('ls_' . $login_session->id . '_u_' . $login_session->user_id . '_ll');

            if ($lastTimeLogin) {
                $lastTimeLogin = Carbon::createFromTimestamp($lastTimeLogin);
                if ($now->greaterThan($lastTimeLogin->addDays($this->maxDaysTokenExpired))) return;
            }

            Cache::forget('ls_' . $login_session->id . '_u_' . $login_session->user_id . '_ll');
            Cache::forget('ls_' . $login_session->id . '_u_' . $login_session->user_id . '_ip');
            $table->where('id', $login_session->id)->delete();
        });
    }
}
