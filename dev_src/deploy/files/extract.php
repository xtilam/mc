
    <?php
    header("Content-Type: application/json");
    $config = json_decode(file_get_contents('./config.json'), true);



    if (!($config['cleaned'] ?? false)) {
        $excludeList = ['./zips', './index.php', 'extract.php'];
        if ($config['excludeVendor'] ?? false) array_push($excludeList, 'vendor');
        deleteDirectory('./', $excludeList);
        $config['cleaned'] = true;
        file_put_contents('./config.json', json_encode($config));
        echo (json_encode([$excludeList]));
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
