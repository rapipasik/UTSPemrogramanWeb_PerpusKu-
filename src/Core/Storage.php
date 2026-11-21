<?php

namespace App\Core;

class Storage
{
    public function __construct(private string $file) {}

    public function read(): array
    {
        if (!is_file($this->file)) {
            return [];
        }
        $json = file_get_contents($this->file);
        $data = json_decode($json ?: '[]', true);
        return is_array($data) ? $data : [];
    }

    public function write(array $data): void
    {
        $directory = dirname($this->file);
        if (!is_dir($directory)) {
            mkdir($directory, 0775, true);
        }
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        if (file_put_contents($this->file, $json, LOCK_EX) === false) {
            throw new \RuntimeException('Gagal menyimpan data.');
        }
    }
}
