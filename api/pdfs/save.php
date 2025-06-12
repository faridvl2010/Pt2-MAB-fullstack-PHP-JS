<?php
session_start();
require '../../config/db.php';

if (!isset($_SESSION['user_id'])) {
  http_response_code(403);
  echo json_encode(['error' => 'No autenticado']);
  exit;
}

$userId = $_SESSION['user_id'];
$pais = $_POST['pais'];

if (!isset($_FILES['pdf'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Archivo no recibido']);
  exit;
}

$fecha = date('Ymd_His');
$sessionId = session_id();
$filename = "{$sessionId}_{$fecha}.pdf";
$filepath = "../../pdfs/$filename";

move_uploaded_file($_FILES['pdf']['tmp_name'], $filepath);

$stmt = $pdo->prepare("INSERT INTO descargas_pdf (user_id, pais, ruta_archivo, fecha) VALUES (?, ?, ?, NOW())");
$stmt->execute([$userId, $pais, "/pdfs/$filename"]);

echo json_encode(['success' => true]);
?>
