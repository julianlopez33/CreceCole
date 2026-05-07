<?php
// Indica el inicio del script PHP
// Ruta del archivo: api/registro.php

header("Content-Type: application/json"); // Establece el encabezado para que la respuesta sea un objeto JSON
require_once "db.php"; // Requiere el archivo de conexión a la base de datos

// Captura el flujo de entrada de la petición (JSON) y lo convierte a un array asociativo
$data = json_decode(file_get_contents("php://input"), true);

// Valida que todos los campos requeridos (nombre, email y password) hayan sido enviados
if (!isset($data['nombre']) || !isset($data['email']) || !isset($data['password'])) {
    // Si falta algún campo, devuelve un error y detiene el script
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit;
}

// Limpia el nombre recibido para evitar inyecciones antes de guardarlo
$nombre = $conn->real_escape_string($data['nombre']);
// Limpia el email recibido para asegurar que la consulta SQL sea segura
$email  = $conn->real_escape_string($data['email']);
// Encripta la contraseña usando el algoritmo por defecto (BCRYPT habitualmente)
$pass   = password_hash($data['password'], PASSWORD_DEFAULT);

// Ejecuta una consulta para verificar si el correo electrónico ya está en uso
$check = $conn->query("SELECT id FROM usuarios WHERE email = '$email'");
// Si el número de filas encontradas es mayor a 0, el correo ya existe
if ($check->num_rows > 0) {
    // Devuelve un error indicando que el correo ya está registrado
    echo json_encode(["success" => false, "message" => "El correo ya está registrado"]);
    exit;
}

// Prepara la sentencia SQL para insertar el nuevo usuario en la tabla usuarios
$sql = "INSERT INTO usuarios (nombre, email, password) VALUES ('$nombre', '$email', '$pass')";

// Ejecuta la consulta de inserción
if ($conn->query($sql)) {
    // Si la inserción es exitosa, devuelve un mensaje de éxito y los datos del usuario registrado
    echo json_encode([
        "success" => true, 
        "message" => "Registro exitoso",
        "user" => ["name" => $nombre, "email" => $email]
    ]);
} else {
    // Si hubo un error en la inserción (problema de base de datos), devuelve el error
    echo json_encode(["success" => false, "message" => "Error al registrar: " . $conn->error]);
}

// Cierra la conexión a la base de datos
$conn->close();
?>
