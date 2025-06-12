<?php
$pdo = new PDO("mysql:host=localhost;dbname=universidades", "root", "admin123");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
?>
