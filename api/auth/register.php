<?php
require '../../config/db.php';
require '../../lib/JWT.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

$username = trim($data['username']);
$password = trim($data['password']);

if (!$username || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos incompletos']);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM usuarios WHERE username = ?");
$stmt->execute([$username]);
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['error' => 'Usuario ya existe']);
    exit;
}

$password_hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare("INSERT INTO usuarios (username, password_hash) VALUES (?, ?)");
$stmt->execute([$username, $password_hash]);

echo json_encode(['success' => true]);
?>
