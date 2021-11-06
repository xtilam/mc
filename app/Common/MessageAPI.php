<?php

use Illuminate\Http\Response;

function messageAPI($type = 'ok', $data = null)
{
    static $config = [
        'auth' => [
            'login' => [
                'user_disabled' => [2, 'Tài khoản bị khóa', Response::HTTP_UNAUTHORIZED],
                'user_not_found' => [-11, 'Tài khoản chưa tồn tại', Response::HTTP_UNPROCESSABLE_ENTITY],
                'failed' => [-1, 'Đăng nhập không chính xác', Response::HTTP_UNAUTHORIZED],
                'user_waiting_verification' => [1, 'Vui lòng xác thực địa chỉ email', Response::HTTP_UNAUTHORIZED],
                'success' => [0, 'Đăng nhập thành công']
            ],
            'register' => [0, 'Đăng kí tài khoản thành công, vào email để kích hoạt tài khoản'],
            'verification' => [
                'succeed' => [0, 'Kích hoạt tài khoản thành công'],
                'failed' => [1, 'Kích hoạt tài khoản thất bại', Response::HTTP_BAD_REQUEST]
            ],
            'token_expired' => [-99, 'Phiên đăng nhập đã hết hạn'],
            'miss_token' => [-98, 'Lỗi khi xác thực người dùng'],
            'token_invalid' => [-98, 'Người dùng không hợp lệ'],
            'ip_invalid' => [-100, 'Phiên đăng nhập không dùng trên địa chỉ mạng của thiết bị này'],
            'logout' => [0, 'Đăng xuất thành công']
        ],
        'error' => [1, 'Đã có lỗi xảy ra! @@', Response::HTTP_INTERNAL_SERVER_ERROR],
        'exception' => [
            'unknown' => []
        ],
        'ok' => [0, 'Thành công']
    ];

    if ($type === true) {
        return $config;
    }

    $type = explode('.', $type);

    if ($type[0] === 'exception') {
        return response()->json([
            'code' => 1,
            'message' => 'Unknown Exception: ' . $data->getMessage(),
            'data' => [
                'stackTrace' => $data->getTrace()
            ]
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    $message = $config;
    foreach ($type as $key) {
        $message = $message[$key];
    }
    return response()->json([
        'code' => $message[0],
        'message' => $message[1],
        'data' => $data
    ], $message[2] ?? Response::HTTP_OK);
}
