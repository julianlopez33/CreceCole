<?php
// Indica el inicio del script PHP
// Ruta del archivo: api/login.php

header("Content-Type: application/json"); // Establece el encabezado para que la respuesta sea interpretada como JSON
require_once "db.php"; // Incluye el archivo de conexión a la base de datos de forma obligatoria

// Lee el cuerpo de la petición (JSON) y lo decodifica en un array asociativo de PHP
$data = json_decode(file_get_contents("php://input"), true);

// Verifica que los campos obligatorios (email y password) estén presentes en los datos recibidos
if (!isset($data['email']) || !isset($data['password'])) {
    // Si faltan datos, devuelve un mensaje de error en formato JSON
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit; // Finaliza la ejecución del script
}

// Escapa el email para prevenir inyecciones SQL antes de usarlo en la consulta
$email = $conn->real_escape_string($data['email']);
// Almacena la contraseña recibida en una variable (sin hashear aún para compararla después)
$pass  = $data['password'];

// Ejecuta una consulta SQL para buscar al usuario por su correo electrónico
$result = $conn->query("SELECT nombre, email, password FROM usuarios WHERE email = '$email'");

// Verifica si la consulta devolvió exactamente un resultado (un usuario encontrado)
if ($result->num_rows === 1) {
    // Obtiene los datos del usuario como un array asociativo
    $user = $result->fetch_assoc();
    
    // Compara la contraseña ingresada con el hash almacenado en la base de datos
    if (password_verify($pass, $user['password'])) {
        // Si la contraseña es correcta, devuelve un mensaje de éxito y los datos básicos del usuario
        echo json_encode([
            "success" => true,
            "message" => "Inicio de sesión exitoso",
            "user" => [
                "name" => $user['nombre'],
                "email" => $user['email']
            ]
        ]);
    } else {
        // Si la contraseña no coincide, devuelve un mensaje de error
        echo json_encode(["success" => false, "message" => "Contraseña incorrecta"]);
    }
} else {
    // Si no se encontró ningún usuario con ese email, devuelve un mensaje de error
    echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
}

// Cierra la conexión con el servidor de la base de datos para liberar recursos
$conn->close();
?>
