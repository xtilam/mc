<?php
$url = 'https://nodejs.org/dist/v16.13.0/node-v16.13.0-linux-x64.tar.xz';
$content = readfile($url);
echo (strlen($content));
