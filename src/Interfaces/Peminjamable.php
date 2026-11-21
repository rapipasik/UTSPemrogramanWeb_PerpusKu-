<?php

namespace App\Interfaces;

interface Peminjamable
{
    public function pinjam(): bool;
    public function kembalikan(): void;
    public function isTersedia(): bool;
}
