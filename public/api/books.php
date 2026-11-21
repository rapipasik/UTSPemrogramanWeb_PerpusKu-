<?php
require_once dirname(__DIR__, 2) . '/autoload.php';

use App\Core\Response;
use App\Services\AuthService;
use App\Services\BukuRepository;
use App\Controllers\BukuController;

$root = dirname(__DIR__, 2);
$repository = new BukuRepository($root . '/data/books.json');
$auth = new AuthService($root . '/data/users.json');
$controller = new BukuController($repository, $auth);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET' && isset($_GET['id'])) {
    $controller->detail((int)$_GET['id']);
}
if ($method === 'GET') {
    $controller->daftar();
}
if ($method === 'POST') {
    $controller->tambah();
}
if ($method === 'DELETE') {
    parse_str(file_get_contents('php://input'), $input);
    $id = (int)($_GET['id'] ?? $input['id'] ?? 0);
    $controller->hapus($id);
}
Response::json(['success' => false, 'message' => 'Method tidak didukung.'], 405);
