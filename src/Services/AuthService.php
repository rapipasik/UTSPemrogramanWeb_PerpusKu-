<?php

namespace App\Services;

use App\Core\Session;
use App\Core\Storage;
use App\Models\Admin;
use App\Models\Member;
use App\Models\User;

class AuthService
{
    private Storage $storage;
    public function __construct(string $file)
    {
        $this->storage = new Storage($file);
    }
    private function makeUser(array $data): User
    {
        $args = [(int)$data['id'], $data['nama'], $data['nim'] ?? '', $data['email'], $data['telepon'] ?? '', $data['password'], $data['status'] ?? 'aktif'];
        return ($data['role'] ?? 'member') === 'admin' ? new Admin(...$args) : new Member(...$args);
    }
    public function register(array $data): array
    {
        $users = $this->storage->read();
        $email = strtolower(trim($data['email'] ?? ''));
        foreach ($users as $user) {
            if (strtolower($user['email']) === $email) throw new \InvalidArgumentException('Email sudah terdaftar.');
        }
        $id = $users ? max(array_column($users, 'id')) + 1 : 1;
        $user = [
            'id' => $id,
            'nama' => trim($data['nama'] ?? ''),
            'nim' => trim($data['nim'] ?? ''),
            'email' => $email,
            'telepon' => trim($data['telepon'] ?? ''),
            'password' => password_hash($data['password'] ?? '', PASSWORD_DEFAULT),
            'role' => 'member',
            'status' => 'aktif'
        ];
        $users[] = $user;
        $this->storage->write($users);
        unset($user['password']);
        return $user;
    }
    public function login(string $email, string $password): array
    {
        foreach ($this->storage->read() as $data) {
            if (strtolower($data['email']) !== strtolower(trim($email))) continue;
            $user = $this->makeUser($data);
            if (!$user->verifyPassword($password)) throw new \InvalidArgumentException('Email atau password salah.');
            if ($user->getStatus() !== 'aktif') throw new \RuntimeException('Akun tidak aktif.');
            $safe = $data;
            unset($safe['password']);
            Session::set('user', $safe);
            return $safe;
        }
        throw new \InvalidArgumentException('Email atau password salah.');
    }
    public function current(): ?array { return Session::get('user'); }
    public function requireUser(): array
    {
        $user = $this->current();
        if (!$user) throw new \RuntimeException('Login diperlukan.');
        return $user;
    }
    public function requireAdmin(): array
    {
        $user = $this->requireUser();
        if (($user['role'] ?? '') !== 'admin') throw new \RuntimeException('Akses admin diperlukan.');
        return $user;
    }
    public function logout(): void { Session::destroy(); }
}
