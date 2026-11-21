<?php

namespace App\Models;

class Member extends User
{
    public function getRole(): string { return 'member'; }
    public function getMaxPeminjaman(): int { return 3; }
}
