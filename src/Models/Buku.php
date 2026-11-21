<?php

namespace App\Models;

use App\Interfaces\Peminjamable;

abstract class Buku implements Peminjamable
{
    protected int $stok;

    public function __construct(
        protected int $id,
        protected string $judul,
        protected string $penulis,
        protected string $kategori,
        protected int $tahun,
        protected string $deskripsi,
        int $stok
    ) {
        $this->stok = max(0, $stok);
    }

    public function getId(): int { return $this->id; }
    public function getJudul(): string { return $this->judul; }
    public function getPenulis(): string { return $this->penulis; }
    public function getKategori(): string { return $this->kategori; }
    public function getTahun(): int { return $this->tahun; }
    public function getDeskripsi(): string { return $this->deskripsi; }
    public function getStok(): int { return $this->stok; }
    public function setStok(int $stok): void { $this->stok = max(0, $stok); }

    public function isTersedia(): bool { return $this->stok > 0; }
    public function pinjam(): bool
    {
        if (!$this->isTersedia()) return false;
        $this->stok--;
        return true;
    }
    public function kembalikan(): void { $this->stok++; }
    abstract public function getInfo(): array;
}
