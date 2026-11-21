<?php

namespace App\Models;

class BukuFisik extends Buku
{
    public function __construct(array $data, private string $rakLokasi = 'Rak Umum')
    {
        parent::__construct((int)$data['id'], $data['judul'], $data['penulis'], $data['kategori'], (int)$data['tahun'], $data['deskripsi'] ?? '', (int)$data['stok']);
    }
    public function getInfo(): array
    {
        return ['tipe' => 'fisik', 'rakLokasi' => $this->rakLokasi];
    }
}
