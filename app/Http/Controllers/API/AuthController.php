<?php

namespace App\Http\Controllers\API;

use App\Common\JAuth;
use App\Common\JWT;
use App\Http\Requests\Auth\ForgotPassword;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Jobs\VerificationAccount;
use App\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;

class AuthController extends Controller
{

    public function login(LoginRequest $req)
    {
        $user = User::where('email', $req->email)->first();


        // register user
        if (!$user) {
            return messageAPI('auth.login.user_not_found', [
                'email' => $req->email,
                'password' => $req->password
            ]);
        }

        //login failed
        if (!$user || !Hash::check($req->password, $user->password))
            return messageAPI('auth.login.failed');

        // user waiting email verification
        if ($user->is_active === -10)
            return messageAPI('auth.login.user_waiting_verification', ['email' => $req->email]);


        if ($user->is_active === 0)
            return messageAPI('auth.login.user_disabled');

        // login_success
        $id_session = DB::table('user_login_session')->insertGetId([
            'user_id' => $user->id,
        ]);

        Cache::forever('ls_' . $id_session . '_u_' . $user->id . '_ip', $req->ip());
        Cache::forever('ls_' . $id_session . '_u_' . $user->id . '_ll', $req->ip());

        $payload = [
            'id' => $user->id,
            'name' => $user->name,
            'id_session' => $id_session
        ];

        $token = JWT::generateToken($payload);
        Session::put('Authorization', $token);

        return messageAPI('auth.login.success', ['token' => $token]);
    }

    public function logout()
    {
        $id = JAuth::$user->id;
        $id_session = JAuth::$user->id_session;

        DB::table('user_login_session')
            ->where('user_id', $id)
            ->where('id', $id_session)
            ->delete();

        Session::put('Authorization');

        return messageAPI('auth.logout');
    }

    public function verification(Request $req)
    {
        try {
            [$isValidCode, $user] = DB::transaction(function () use ($req) {
                $verification_code = $req->code;
                $id = $req->user_id;
                $user = null;
                $isValidCode = DB::table('users_waiting_email_verification')
                    ->where('id', $id)
                    ->where('verification_code', $verification_code)->delete();

                if ($isValidCode) {
                    $user = User::find($id);
                    $user->is_active = 1;
                    $user->save();
                }
                return [$isValidCode, $user];
            });

            if ($isValidCode) {
                return messageAPI('auth.verification.succeed', [
                    'email' => $user->email,
                    'name' => $user->name
                ]);
            }

            return messageAPI('auth.verification.failed');
        } catch (Exception $e) {
            return messageAPI('exception', $e);
        }
    }

    public function register(RegisterRequest $req)
    {
        try {
            return DB::transaction(function () use ($req) {
                $user = new User($req->only('email', 'name'));
                $user->password = Hash::make($req->password);
                $verificationCode = Str::random(20);
                // save user
                $user->save();
                DB::table('users_waiting_email_verification')->insert([
                    'id' => $user->id,
                    'verification_code' => $verificationCode
                ]);

                //send mail verification
                (new VerificationAccount($user->email, [
                    'email' => $user->email,
                    'name' => $req->name,
                    'verification_code' => $verificationCode,
                    'id' => $user->id
                ]))->handle();

                return messageAPI('auth.register', [
                    'email' => $user->email,
                    'name' => $user->name
                ]);
            });
        } catch (\Exception $ex) {
            return messageAPI('exception', $ex);
        }
    }

    public function forgotPassword(ForgotPassword $req)
    {
        // $email = 
    }
}
