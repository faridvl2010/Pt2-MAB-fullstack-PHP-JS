<?php
require '../../config/db.php';
require '../../lib/JWT.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

$username = trim($data['username']);
$password = trim($data['password']);

$secretKey = 'clave_secreta_segura';

$stmt = $pdo->prepare("SELECT * FROM usuarios WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password_hash'])) {
$payload = [
    'user_id' => $user['id'],
    'username' => $user['username'], // 👈 esto es clave
    'iat' => time(),
    'exp' => time() + 3600
];

    $token = JWT::encode($payload, $secretKey);
    echo json_encode(['token' => $token]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Credenciales inválidas']);
}
?>
