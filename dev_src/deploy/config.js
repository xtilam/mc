const fs = require('fs')
const { dirname } = require('path')
const { infinityFree, ultimatefreehost } = require('./password')

module.exports = {
    hosting: {
        1: {
            connection: {
                name: 'InfinityFree',
                host: 'ftpupload.net',
                password: infinityFree.ftp,
                user: 'epiz_29477670'
            },
            env: {
                "APP_URL": 'http://dinzll.great-site.net',
                "DB_HOST": "sql112.epizy.com",
                "DB_PORT": "3306",
                "DB_DATABASE": "epiz_29477670_log",
                "DB_USERNAME": "epiz_29477670",
                "DB_PASSWORD": infinityFree.database,
            }
        },
        2: {
            connection: {
                name: 'UltimateFreeHost',
                host: 'ftp.ultimatefreehost.in',
                password: ultimatefreehost.ftp,
                user: 'ltm_30008915'
            },
            env: {
                "APP_URL": 'http://dinzltt.ultimatefreehost.in',
                "DB_HOST": "sql100.ultimatefreehost.in",
                "DB_PORT": "3306",
                "DB_DATABASE": "ltm_30008915_log",
                "DB_USERNAME": "ltm_30008915",
                "DB_PASSWORD": ultimatefreehost.database,
            }
        },
        3: {
            connection: {
                name: 'InfinityFree',
                host: 'ftpupload.net',
                password: infinityFree.ftp,
                user: 'epiz_29477670'
            },
            env: {
                "APP_URL": 'http://dinzltt.iblogger.org',
                "DB_HOST": "sql112.epizy.com",
                "DB_PORT": "3306",
                "DB_DATABASE": "epiz_29477670_log",
                "DB_USERNAME": "epiz_29477670",
                "DB_PASSWORD": infinityFree.database,
            },
            publicPath: 'dinzltt.iblogger.org/htdocs'
        },
    },
    listFileCopy: [
        { path: 'composer.json' },
        {
            path: 'public', exclude: [
                '.htaccess', 'web.config', 'robots.txt'
            ]
        },
        { path: 'config' },
        { path: 'bootstrap' },
        { path: 'artisan' },
        { path: 'server.php' },
        { path: 'app' },
        { path: 'resources' },
        { path: 'routes' },
        { path: 'database' },
        { path: '.htaccess.ren', content: `RewriteEngine on\nRewriteCond %{REQUEST_URI} !^public\nRewriteRule ^(.*)$ public/$1 [L]\nErrorDocument 404 /public/index.php\nErrorDocument 403 /public/index.php\nErrorDocument 500 /public/index.php` },
        { path: 'public/.htaccess', content: '<IfModule mod_rewrite.c>\n    <IfModule mod_negotiation.c>\n        Options -MultiViews -Indexes\n    </IfModule>\n\n    RewriteEngine On\n    <FilesMatch ".(ico|pdf|jpg|jpeg|png|webp|gif|html|htm|xml|txt|xsl|css|svg)$">\n    Header set Cache-Control "max-age=18000"\n    </FilesMatch>\n\n    # Handle Authorization Header\n    RewriteCond %{HTTP:Authorization} .\n    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]\n\n    # Redirect Trailing Slashes If Not A Folder...\n    RewriteCond %{REQUEST_FILENAME} !-d\n    RewriteCond %{REQUEST_URI} (.+)/$\n    RewriteRule ^ %1 [L,R=301]\n\n    # Handle Front Controller...\n    RewriteCond %{REQUEST_FILENAME} !-d\n    RewriteCond %{REQUEST_FILENAME} !-f\n    RewriteRule ^ index.php [L]\n</IfModule>' },
    ],
    createFolder: [
        'storage/app/public',
        'storage/framework/sessions',
        'storage/framework/views',
        'storage/framework/cache',
        'storage/logs',
    ],
    artisanPassword: 'thanhbotay007thanhbotay008thanhbotay009',
    envConfig: {
        "APP_NAME": "Laravel",
        "APP_ENV": "production",
        "APP_KEY": "base64:A7mKtk2JsdbclCTd9nQTJjf7//rA+1rnVKd4DWn4Y98=",
        "APP_DEBUG": "false",
        "LOG_CHANNEL": "stack",
        "DB_CONNECTION": "mysql",
        "BROADCAST_DRIVER": "log",
        "CACHE_DRIVER": "file",
        "QUEUE_CONNECTION": "sync",
        "SESSION_DRIVER": "file",
        "SESSION_LIFETIME": "10080",
        "REDIS_HOST": "127.0.0.1",
        "REDIS_PASSWORD": "null",
        "REDIS_PORT": "6379",
        "MAIL_DRIVER": "smtp",
        "MAIL_HOST": "smtp.gmail.com",
        "MAIL_PORT": "587",
        "MAIL_USERNAME": "ztilam90@gmail.com",
        "MAIL_PASSWORD": "thanhbotay007",
        "MAIL_ENCRYPTION": "tls",
        "MAIL_FROM_NAME": "DinzApp",
        "AWS_ACCESS_KEY_ID": "",
        "AWS_SECRET_ACCESS_KEY": "",
        "AWS_DEFAULT_REGION": "us-east-1",
        "AWS_BUCKET": "",
        "PUSHER_APP_ID": "",
        "PUSHER_APP_KEY": "",
        "PUSHER_APP_SECRET": "",
        "PUSHER_APP_CLUSTER": "mt1",
        "MIX_PUSHER_APP_KEY": "\"${PUSHER_APP_KEY}\"",
        "MIX_PUSHER_APP_CLUSTER": "\"${PUSHER_APP_CLUSTER}\"",
        "LAST_TIME": new Date().getTime()
    },
    indexFile: fs.readFileSync(__dirname + '/files/index.html', { encoding: 'utf-8' }),
    extractFile: fs.readFileSync(__dirname + '/files/extract.php', { encoding: 'utf-8' }),
    helpText: fs.readFileSync(__dirname + '/files/help-text.txt', { encoding: 'utf-8' })
}