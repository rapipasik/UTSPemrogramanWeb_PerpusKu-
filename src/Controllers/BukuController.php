<?php

namespace App\Controllers;

use App\Core\Response;
use App\Services\AuthService;
use App\Services\BukuRepository;

class BukuController
{
    public function __construct(private BukuRepository $repository, private AuthService $auth) {}
    public function daftar(): void
    {
        $keyword = trim($_GET['q'] ?? '');
        $kategori = trim($_GET['kategori'] ?? '');
        $tipe = trim($_GET['tipe'] ?? '');
        $books = array_values(array_filter($this->repository->all(), function ($b) use ($keyword, $kategori, $tipe) {
            $matchText = $keyword === '' || stripos($b['judul'], $keyword) !== false || stripos($b['penulis'], $keyword) !== false;
            return $matchText && ($kategori === '' || $b['kategori'] === $kategori) && ($tipe === '' || $b['tipe'] === $tipe);
        }));
        Response::json(['success' => true, 'data' => $books]);
    }
    public function detail(int $id): void
    {
        $book = $this->repository->find($id);
        if (!$book) Response::json(['success' => false, 'message' => 'Buku tidak ditemukan.'], 404);
        $object = $this->repository->toObject($book);
        $book = array_merge($book, $object->getInfo());
        Response::json(['success' => true, 'data' => $book]);
    }
    public function tambah(): void
    {
        try {
            $this->auth->requireAdmin();
            $input = json_decode(file_get_contents('php://input'), true);
            if (!is_array($input)) $input = $_POST;
            if (trim($input['judul'] ?? '') === '' || trim($input['penulis'] ?? '') === '') {
                Response::json(['success' => false, 'message' => 'Judul dan penulis wajib diisi.'], 422);
            }
            Response::json(['success' => true, 'data' => $this->repository->create($input)], 201);
        } catch (\Throwable $e) {
            $status = $e instanceof \RuntimeException ? 403 : 400;
            Response::json(['success' => false, 'message' => $e->getMessage()], $status);
        }
    }
    public function hapus(int $id): void
    {
        try {
            $this->auth->requireAdmin();
            if (!$this->repository->delete($id)) Response::json(['success' => false, 'message' => 'Buku tidak ditemukan.'], 404);
            Response::json(['success' => true, 'message' => 'Buku berhasil dihapus.']);
        } catch (\Throwable $e) {
            Response::json(['success' => false, 'message' => $e->getMessage()], 403);
        }
    }
}
