<?php
require '../../config/db.php';
require '../../lib/JWT.php';

$headers = getallheaders();
if (!isset($headers['Authorization'])) {
  http_response_code(403);
  echo json_encode(['error' => 'Token no enviado']);
  exit;
}

$secretKey = 'clave_secreta_segura';
$token = str_replace('Bearer ', '', $headers['Authorization']);
try {
    $decoded = JWT::decode($token, $secretKey);
    $userId = $decoded->user_id;
} catch (Exception $e) {
    http_response_code(403);
    echo json_encode(['error' => 'Token inválido o expirado']);
    exit;
}

$pais = $_POST['pais'];
if (!isset($_FILES['pdf'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Archivo no recibido']);
  exit;
}

$fecha = date('Ymd_His');
$filename = "{$userId}_{$fecha}.pdf";
$filepath = "../../pdfs/$filename";

move_uploaded_file($_FILES['pdf']['tmp_name'], $filepath);

$stmt = $pdo->prepare("INSERT INTO descargas_pdf (user_id, pais, ruta_archivo, fecha) VALUES (?, ?, ?, NOW())");
$stmt->execute([$userId, $pais, "/pdfs/$filename"]);

echo json_encode(['success' => true]);
?>
