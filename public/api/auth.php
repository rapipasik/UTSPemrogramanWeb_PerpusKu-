<?php
require_once dirname(__DIR__, 2) . '/autoload.php';

use App\Core\Response;
use App\Controllers\AuthController;
use App\Services\AuthService;

$root = dirname(__DIR__, 2);
$controller = new AuthController(new AuthService($root . '/data/users.json'));
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'POST' && $action === 'register') $controller->register();
if ($method === 'POST' && $action === 'login') $controller->login();
if ($method === 'POST' && $action === 'logout') $controller->logout();
if ($method === 'GET' && $action === 'me') $controller->me();
Response::json(['success' => false, 'message' => 'Action tidak ditemukan.'], 404);
