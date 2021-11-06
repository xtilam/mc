<html>

<head>
    <title>React App</title>
    <link rel="stylesheet" href="/css/style.css?v={{env('LAST_TIME')}}">
    <meta content='width=device-width, initial-scale=1' name='viewport' />

    @if (env('APP_ENV')=='local')
    <script src="https://unpkg.com/react@17.0.2/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17.0.2/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@mui/material@5.0.3/umd/material-ui.development.js"></script>
    @else
    <script src='https://unpkg.com/react@17.0.2/umd/react.production.min.js'></script>
    <script src='https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js'> </script>
    <script src="https://unpkg.com/@mui/material@5.0.3/umd/material-ui.production.min.js"></script>
    @endif

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

    <script src="https://unpkg.com/react-router-dom@5.3.0/umd/react-router-dom.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</head>

<body>
    <div id="app"></div>
    <script src="/js/bundle.js?v={{env('LAST_TIME')}}"></script>

    @if (env('APP_ENV')=='local')
    <script>
        {
            let path = "{{env('LIVE_RELOAD_PATH') ?? 'http://localhost:35729'}}"
            document.write(`<script src="${path}/livereload.js?snipver=1"></${'script'}>`)
        }
    </script>
    @endif
</body>

</html>
<?php
http_response_code(200);
die(0);
?>