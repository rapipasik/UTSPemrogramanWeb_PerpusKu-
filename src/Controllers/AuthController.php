<?php

namespace App\Controllers;

use App\Core\Response;
use App\Services\AuthService;

class AuthController
{
    public function __construct(private AuthService $auth) {}
    public function register(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!is_array($input)) $input = $_POST;
        if (strlen($input['password'] ?? '') < 8) Response::json(['success' => false, 'message' => 'Password minimal 8 karakter.'], 422);
        if (($input['password'] ?? '') !== ($input['konfirmasi'] ?? '')) Response::json(['success' => false, 'message' => 'Konfirmasi password tidak sama.'], 422);
        try {
            $user = $this->auth->register($input);
            Response::json(['success' => true, 'data' => $user], 201);
        } catch (\Throwable $e) {
            Response::json(['success' => false, 'message' => $e->getMessage()], 409);
        }
    }
    public function login(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!is_array($input)) $input = $_POST;
        try {
            $user = $this->auth->login($input['email'] ?? '', $input['password'] ?? '');
            Response::json(['success' => true, 'data' => $user]);
        } catch (\Throwable $e) {
            Response::json(['success' => false, 'message' => $e->getMessage()], 401);
        }
    }
    public function logout(): void
    {
        $this->auth->logout();
        Response::json(['success' => true, 'message' => 'Berhasil keluar.']);
    }
    public function me(): void
    {
        $user = $this->auth->current();
        if (!$user) Response::json(['success' => false, 'message' => 'Belum login.'], 401);
        Response::json(['success' => true, 'data' => $user]);
    }
}
