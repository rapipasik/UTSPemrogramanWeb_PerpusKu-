<?php

namespace App\Services;

use App\Core\Storage;

class PeminjamanService
{
    private Storage $loans;
    private Storage $books;
    private Storage $users;
    public function __construct(string $loansFile, string $booksFile, string $usersFile)
    {
        $this->loans = new Storage($loansFile);
        $this->books = new Storage($booksFile);
        $this->users = new Storage($usersFile);
    }
    public function all(): array { return $this->loans->read(); }
    public function forUser(int $userId): array
    {
        $loans = array_values(array_filter($this->all(), fn($l) => (int)$l['user_id'] === $userId));
        $books = $this->books->read();
        $byId = array_column($books, null, 'id');
        foreach ($loans as &$loan) {
            $loan['judul'] = $byId[$loan['book_id']]['judul'] ?? 'Buku tidak ditemukan';
            $loan['denda'] = $this->calculateFine($loan);
            if ($loan['status'] === 'dipinjam' && strtotime($loan['jatuh_tempo']) < strtotime('today')) {
                $loan['status'] = 'terlambat';
            }
        }
        return $loans;
    }
    public function pinjam(int $userId, int $bookId): array
    {
        $active = array_filter($this->all(), fn($l) => (int)$l['user_id'] === $userId && $l['status'] !== 'dikembalikan');
        if (count($active) >= 3) throw new \RuntimeException('Batas maksimal 3 peminjaman aktif tercapai.');

        $books = $this->books->read();
        $found = null;
        foreach ($books as &$book) {
            if ((int)$book['id'] === $bookId) { $found = &$book; break; }
        }
        if (!$found) throw new \InvalidArgumentException('Buku tidak ditemukan.');
        if ((int)$found['stok'] <= 0) throw new \RuntimeException('Stok buku habis.');

        $found['stok']--;
        $this->books->write($books);

        $loans = $this->all();
        $id = $loans ? max(array_column($loans, 'id')) + 1 : 101;
        $today = date('Y-m-d');
        $loan = [
            'id' => $id, 'user_id' => $userId, 'book_id' => $bookId,
            'tgl_pinjam' => $today, 'jatuh_tempo' => date('Y-m-d', strtotime('+7 days')),
            'tgl_kembali' => null, 'status' => 'dipinjam'
        ];
        $loans[] = $loan;
        $this->loans->write($loans);
        return $loan;
    }
    public function kembalikan(int $userId, int $loanId): array
    {
        $loans = $this->all();
        $found = null;
        foreach ($loans as &$loan) {
            if ((int)$loan['id'] === $loanId) { $found = &$loan; break; }
        }
        if (!$found) throw new \InvalidArgumentException('Peminjaman tidak ditemukan.');
        if ((int)$found['user_id'] !== $userId) throw new \RuntimeException('Peminjaman tidak milik akun ini.');
        if ($found['status'] === 'dikembalikan') throw new \RuntimeException('Buku sudah dikembalikan.');

        $found['tgl_kembali'] = date('Y-m-d');
        $found['status'] = 'dikembalikan';
        $this->loans->write($loans);

        $books = $this->books->read();
        foreach ($books as &$book) {
            if ((int)$book['id'] === (int)$found['book_id']) {
                $book['stok']++;
                break;
            }
        }
        $this->books->write($books);
        return $found;
    }
    private function calculateFine(array $loan): int
    {
        if ($loan['tgl_kembali'] !== null) return 0;
        $late = (int)floor((strtotime('today') - strtotime($loan['jatuh_tempo'])) / 86400);
        return max(0, $late * 1000);
    }
    public function members(): array
    {
        $users = $this->users->read();
        return array_values(array_map(function ($u) {
            unset($u['password']);
            return $u;
        }, array_filter($users, fn($u) => ($u['role'] ?? 'member') === 'member')));
    }
}
