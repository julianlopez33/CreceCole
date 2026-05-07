<?php
// Indica el inicio del script PHP
// Ruta del archivo: api/db.php

$host = "localhost"; // Define el servidor de la base de datos (normalmente localhost)
$user = "root"; // Define el nombre de usuario de la base de datos (root por defecto en XAMPP)
$pass = ""; // Define la contraseña de la base de datos (vacía por defecto en XAMPP)
$db = "crece_cole"; // Define el nombre de la base de datos a la que nos conectaremos

// Crea una nueva instancia de la clase mysqli para establecer la conexión
$conn = new mysqli($host, $user, $pass, $db);

// Verifica si hubo algún error durante el intento de conexión
if ($conn->connect_error) {
    // Si hay error, termina el script y devuelve un mensaje JSON con el detalle del error
    die(json_encode(["success" => false, "message" => "Error de conexión: " . $conn->connect_error]));
}

// Establece el juego de caracteres a utf8mb4 para soportar acentos y caracteres especiales
$conn->set_charset("utf8mb4");
?>
