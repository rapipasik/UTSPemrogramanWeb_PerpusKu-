<?php

namespace App\Models;

class EBook extends Buku
{
    public function __construct(array $data, private string $formatFile = 'PDF', private float $ukuranMB = 2.5)
    {
        parent::__construct((int)$data['id'], $data['judul'], $data['penulis'], $data['kategori'], (int)$data['tahun'], $data['deskripsi'] ?? '', (int)$data['stok']);
    }
    public function getInfo(): array
    {
        return ['tipe' => 'ebook', 'formatFile' => $this->formatFile, 'ukuranMB' => $this->ukuranMB];
    }
}
