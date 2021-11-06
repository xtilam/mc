<!DOCTYPE html>
<html>

<head>
    <title>Xác thực thông tin người dùng</title>
</head>

<body>

    <h1>Đây là tài khoản mới của bạn trên hệ thống DinzApp</h1>
    <p>Xin chào {{ $name }}</p>
    <p>Email: {{ $email }}</p>
    <a style="color:blue" href="{{ env('APP_URL') }}/xac-thuc-email?user_id={{ $id }}&code={{ $verification_code }}">Kích hoạt tài khoản của bạn trên hệ thống của chúng tôi</a>
    <p>Thank you, {{ $name }}</p>

</body>

</html>