<?php
require '../../config/db.php';
require '../../lib/JWT.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

$username = trim($data['username']);
$password = trim($data['password']);
$secretKey = 'clave_secreta_segura'; // Cambiar por algo más fuerte en producción

$stmt = $pdo->prepare("SELECT * FROM usuarios WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password_hash'])) {
    $payload = [
        'user_id' => $user['id'],
        'iat' => time(),
        'exp' => time() + 3600 // Token válido por 1 hora
    ];
    $token = JWT::encode($payload, $secretKey);
    echo json_encode(['token' => $token]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Credenciales inválidas']);
}
?>
