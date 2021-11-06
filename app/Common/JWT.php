<?php

namespace App\Common;

use Firebase\JWT\JWT as FireBaseJWT;

class JWT
{
    protected static $secretKey = 'rgQ9LEvkcAmj9UTBNAOe';

    public static function generateToken($payload)
    {
        $token = FireBaseJWT::encode($payload, static::$secretKey);
        return $token;
    }

    public static function claimToken($token)
    {
        try {
            return FireBaseJWT::decode($token, static::$secretKey, array('HS256'));
        } catch (\Throwable $th) {
            return null;
        }
    }
}
