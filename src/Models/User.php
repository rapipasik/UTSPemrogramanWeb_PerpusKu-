<?php

namespace App\Models;

abstract class User
{
    public function __construct(
        protected int $id,
        protected string $nama,
        protected string $nim,
        protected string $email,
        protected string $telepon,
        protected string $password,
        protected string $status = 'aktif'
    ) {}
    public function getId(): int { return $this->id; }
    public function getNama(): string { return $this->nama; }
    public function getNim(): string { return $this->nim; }
    public function getEmail(): string { return $this->email; }
    public function getStatus(): string { return $this->status; }
    public function verifyPassword(string $password): bool { return password_verify($password, $this->password); }
    abstract public function getRole(): string;
}
