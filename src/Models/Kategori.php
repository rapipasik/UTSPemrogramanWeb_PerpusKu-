<?php

namespace App\Models;

class Kategori
{
    public function __construct(private int $id, private string $nama) {}
    public function getId(): int { return $this->id; }
    public function getNama(): string { return $this->nama; }
}
