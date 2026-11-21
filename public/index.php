<?php
require_once dirname(__DIR__) . '/autoload.php';

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = trim($path, '/');
if (str_starts_with($path, 'api/')) {
    $file = __DIR__ . '/' . ($path . (str_ends_with($path, '.php') ? '' : '.php'));
    if (is_file($file)) {
        require $file;
        exit;
    }
}

$page = basename($path);
if ($page === '' || $page === 'perpustakaan-digital') $page = 'index.html';
$file = __DIR__ . '/' . $page;
if (is_file($file)) {
    return require $file;
}
http_response_code(404);
echo 'Halaman tidak ditemukan.';
