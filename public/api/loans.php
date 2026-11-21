<?php
require_once dirname(__DIR__, 2) . '/autoload.php';

use App\Core\Response;
use App\Controllers\PeminjamanController;
use App\Services\AuthService;
use App\Services\PeminjamanService;

$root = dirname(__DIR__, 2);
$auth = new AuthService($root . '/data/users.json');
$service = new PeminjamanService($root . '/data/loans.json', $root . '/data/books.json', $root . '/data/users.json');
$controller = new PeminjamanController($service, $auth);
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET' && $action === 'all') $controller->semua();
if ($method === 'GET') $controller->riwayat();
if ($method === 'POST' && $action === 'borrow') $controller->pinjam();
if ($method === 'POST' && $action === 'return') $controller->kembalikan((int)($_GET['id'] ?? 0));
if ($method === 'DELETE' && $action === 'return') $controller->kembalikan((int)($_GET['id'] ?? 0));
Response::json(['success' => false, 'message' => 'Action tidak ditemukan.'], 404);
