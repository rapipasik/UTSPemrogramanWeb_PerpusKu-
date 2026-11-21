<?php
require_once dirname(__DIR__, 2) . '/autoload.php';

use App\Core\Response;
use App\Services\AuthService;
use App\Services\PeminjamanService;

$root = dirname(__DIR__, 2);
$auth = new AuthService($root . '/data/users.json');
$service = new PeminjamanService($root . '/data/loans.json', $root . '/data/books.json', $root . '/data/users.json');
try {
    $auth->requireAdmin();
    Response::json(['success' => true, 'data' => $service->members()]);
} catch (\Throwable $e) {
    Response::json(['success' => false, 'message' => $e->getMessage()], 403);
}
