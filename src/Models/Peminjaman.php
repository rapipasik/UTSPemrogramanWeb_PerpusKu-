<?php

namespace App\Models;

class Peminjaman
{
    public function __construct(
        private int $id,
        private int $userId,
        private int $bookId,
        private string $tglPinjam,
        private string $jatuhTempo,
        private ?string $tglKembali,
        private string $status
    ) {}
    public function hitungDenda(float $perHari = 1000): float
    {
        if ($this->tglKembali !== null) return 0;
        $batas = strtotime($this->jatuhTempo);
        $hari = (int) floor((time() - $batas) / 86400);
        return $hari > 0 ? $hari * $perHari : 0;
    }
    public function getStatus(): string { return $this->status; }
    public function toArray(): array
    {
        return [
            'id' => $this->id, 'user_id' => $this->userId, 'book_id' => $this->bookId,
            'tgl_pinjam' => $this->tglPinjam, 'jatuh_tempo' => $this->jatuhTempo,
            'tgl_kembali' => $this->tglKembali, 'status' => $this->status
        ];
    }
}
