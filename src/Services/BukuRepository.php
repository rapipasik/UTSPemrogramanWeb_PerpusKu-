<?php

namespace App\Services;

use App\Core\Storage;
use App\Models\EBook;
use App\Models\BukuFisik;
use App\Models\Buku;

class BukuRepository
{
    private Storage $storage;
    public function __construct(string $file)
    {
        $this->storage = new Storage($file);
    }
    public function all(): array { return $this->storage->read(); }
    public function find(int $id): ?array
    {
        foreach ($this->all() as $book) {
            if ((int)$book['id'] === $id) return $book;
        }
        return null;
    }
    public function create(array $data): array
    {
        $books = $this->all();
        $id = $books ? max(array_column($books, 'id')) + 1 : 1;
        $book = [
            'id' => $id,
            'judul' => trim($data['judul'] ?? ''),
            'penulis' => trim($data['penulis'] ?? ''),
            'kategori' => trim($data['kategori'] ?? 'Lainnya'),
            'tahun' => (int)($data['tahun'] ?? date('Y')),
            'tipe' => in_array($data['tipe'] ?? '', ['ebook', 'fisik'], true) ? $data['tipe'] : 'ebook',
            'stok' => max(0, (int)($data['stok'] ?? 0)),
            'deskripsi' => trim($data['deskripsi'] ?? '')
        ];
        $books[] = $book;
        $this->storage->write($books);
        return $book;
    }
    public function delete(int $id): bool
    {
        $books = $this->all();
        $remaining = array_values(array_filter($books, fn($b) => (int)$b['id'] !== $id));
        if (count($remaining) === count($books)) return false;
        $this->storage->write($remaining);
        return true;
    }
    public function toObject(array $data): Buku
    {
        return ($data['tipe'] ?? 'ebook') === 'ebook' ? new EBook($data) : new BukuFisik($data);
    }
}
