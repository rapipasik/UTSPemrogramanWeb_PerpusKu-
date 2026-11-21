<?php

namespace App\Controllers;

use App\Core\Response;
use App\Services\AuthService;
use App\Services\PeminjamanService;

class PeminjamanController
{
    public function __construct(private PeminjamanService $service, private AuthService $auth) {}
    public function riwayat(): void
    {
        try {
            $user = $this->auth->requireUser();
            Response::json(['success' => true, 'data' => $this->service->forUser((int)$user['id'])]);
        } catch (\Throwable $e) {
            Response::json(['success' => false, 'message' => $e->getMessage()], 401);
        }
    }
    public function semua(): void
    {
        try {
            $this->auth->requireAdmin();
            $loans = $this->service->all();
            $books = (new \App\Core\Storage(dirname(__DIR__, 2) . '/data/books.json'))->read();
            $byId = array_column($books, null, 'id');
            foreach ($loans as &$loan) $loan['judul'] = $byId[$loan['book_id']]['judul'] ?? 'Buku tidak ditemukan';
            Response::json(['success' => true, 'data' => $loans]);
        } catch (\Throwable $e) {
            Response::json(['success' => false, 'message' => $e->getMessage()], 403);
        }
    }
    public function pinjam(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!is_array($input)) $input = $_POST;
        try {
            $user = $this->auth->requireUser();
            $loan = $this->service->pinjam((int)$user['id'], (int)($input['book_id'] ?? 0));
            Response::json(['success' => true, 'data' => $loan], 201);
        } catch (\Throwable $e) {
            $status = str_contains($e->getMessage(), 'Login') ? 401 : 400;
            Response::json(['success' => false, 'message' => $e->getMessage()], $status);
        }
    }
    public function kembalikan(int $id): void
    {
        try {
            $user = $this->auth->requireUser();
            $loan = $this->service->kembalikan((int)$user['id'], $id);
            Response::json(['success' => true, 'data' => $loan]);
        } catch (\Throwable $e) {
            Response::json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }
}
