module.exports = {
    hosting: {
        1: {
            connection: {
                name: 'InfinityFree',
                host: 'ftpupload.net',
                password: 's1hqTJdIZtfK',
                user: 'epiz_29477670'
            },
            env: {
                "APP_URL": 'http://dinzll.great-site.net',
                "DB_HOST": "sql112.epizy.com",
                "DB_PORT": "3306",
                "DB_DATABASE": "epiz_29477670_log",
                "DB_USERNAME": "epiz_29477670",
                "DB_PASSWORD": "s1hqTJdIZtfK",
            }
        },
        2: {
            connection: {
                name: 'UltimateFreeHost',
                host: 'ftp.ultimatefreehost.in',
                password: '5X*?xdKFrDmX4Dt',
                user: 'ltm_30008915'
            },
            env: {
                "APP_URL": 'http://dinzltt.ultimatefreehost.in',
                "DB_HOST": "sql100.ultimatefreehost.in",
                "DB_PORT": "3306",
                "DB_DATABASE": "ltm_30008915_log",
                "DB_USERNAME": "ltm_30008915",
                "DB_PASSWORD": "5X*?xdKFrDmX4Dt",
            }
        },
        3: {
            connection: {
                name: 'InfinityFree',
                host: 'ftpupload.net',
                password: 's1hqTJdIZtfK',
                user: 'epiz_29477670'
            },
            env: {
                "APP_URL": 'http://dinzltt.iblogger.org',
                "DB_HOST": "sql112.epizy.com",
                "DB_PORT": "3306",
                "DB_DATABASE": "epiz_29477670_log",
                "DB_USERNAME": "epiz_29477670",
                "DB_PASSWORD": "s1hqTJdIZtfK",
            },
            publicPath: 'dinzltt.iblogger.org/htdocs'
        },
    },
    listFilePush: [
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
    indexFile: `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.23.0/axios.min.js"></script>
</head>

<body>
    <script>
        async function main() {
            await extract()
            // window.location.href = '/'
        }

        async function extract() {
            console.log('start extract')
            const artisanCommands = (await axios.get('/config.json')).data.artisanCommand
            
            writeScreen('start extract')
            while (true) {
                const data = (await axios.get('/extract.php')).data
                console.log(data)
                writeScreen(data[0])
                if (data[0] === 'done') break
            }


            const artisanPassword = 'thanhbotay007thanhbotay008thanhbotay009'

            if (Array.isArray(artisanCommands)) {
                writeScreen('=> artisanCommand')
                for (const command of artisanCommands) {
                    const data = (await axios.get(\`/api/artisan?password=\${artisanPassword}&command=\${command}\`)).data.data
                    writeScreen(data)
                    console.log(data)
                }
                writeScreen('=> remove artisanController')
                writeScreen((await axios.get('/api/artisan/remove')).data.data)
            }
        }

        function writeScreen(text) {
            const content = document.createElement('p')
            content.innerHTML = text
            document.body.append(content)
        }

        main()
    </script>
</body>

</html>
    `,
    extractFile: `
    <?php
    header("Content-Type: application/json");
    $config = json_decode(file_get_contents('./config.json'), true);
    
    

    if (!($config['cleaned'] ?? false)) {
        $excludeList = ['./zips', './index.php', 'extract.php'];
        if ($config['excludeVendor'] ?? false) array_push($excludeList, 'vendor');
        deleteDirectory('./', $excludeList);
        $config['cleaned'] = true;
        file_put_contents('./config.json', json_encode($config));
        echo(json_encode([$excludeList]));
        die();
    }

    $files = array_diff(scandir('./zips'), array('.', '..'));

    foreach ($files as $file) {
        if (!zipExtract('./zips/' . $file, './')) {
            http_response_code(404);
            die();
        }
        unlink('./zips/' . $file);
        echo ('["./zips/' . $file . '"]');
        die();
    }
    
    deleteDirectory('./zips');
    unlink('./index.php');
    unlink('./extract.php');
    unlink('./config.json');
    rename('./.htaccess.ren', './.htaccess');
    echo ('["done"]');
    
    function zipExtract($file, $dest)
    {
        $zip = new ZipArchive;
        $res = $zip->open($file);
        if ($res === TRUE) {
            $zip->extractTo($dest);
            $zip->close();
            return true;
        } else {
            return false;
        }
    }
    
    function deleteDirectory($dir, $exclude = [])
    {
        static $checkDelete = null;
        if ($checkDelete === null) {
            $maxItem = count($exclude);
            if ($maxItem) {
                foreach ($exclude as $i => $v) {
                    $exclude[$i] = realpath($v);
                }
            }
    
            $dir = realpath($dir);
    
            $checkDelete = function ($dir, $exclude) {
                $maxItem = count($exclude);
                foreach ($exclude as $i => $v) {
                    if ($dir === $v) {
                        unset($exclude[$i]);
                        return [true, $exclude];
                    }
                }
                return [false, $exclude];
            };
        }
    
        if (!file_exists($dir)) {
            return true;
        }
    
        if (!is_dir($dir)) {
            return unlink($dir);
        }
    
        $deleteDir = true;
    
        foreach (scandir($dir) as $item) {
            if ($item == '.' || $item == '..') {
                continue;
            }
            $result = $checkDelete($dir . DIRECTORY_SEPARATOR . $item, $exclude);
            if ($result[0] === true) {
                $deleteDir = false;
                $exclude = $result[1];
                continue;
            }
    
            if (!deleteDirectory($dir . DIRECTORY_SEPARATOR . $item, $exclude)) {
                $deleteDir = false;
            }
        }
    
        if ($deleteDir) {
            return rmdir($dir);
        }
    
        return false;
    }
    
    `,
    helpText: `
    Usage: node dev [command] -- [...[ --config, ...config_value]]
    Ex: npm run dev deploy --vendor --hosting 1
    Command: 
        deploy: deploy this application to hosting
            args: 
                --vendor: deploy with vendor folder
                --hosting: select hosting deploy, id hosting in file dev.config.js ( connection )
`
}