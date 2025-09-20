<?php
$server = "switchback.proxy.rlwy.net"; // Nombre del host de la base de datos
$user = "root"; // Nombre de usuario de la base de datos
$password = "HqkxLGtqhrfBHtizktNmjtOBPXPsJbIK"; // Contraseña de la base de datos
$dbname = "sistema_ordenes"; // Nombre de la base de datos
$puerto = "48741"; // Puerto de la base de datos

$conexion = new mysqli($server, $user, $password, $dbname, $puerto);


// Verificar si la conexión a la base de datos se estableció correctamente
if ($conexion->connect_errno) {
    die("Error al conectar a la base de datos: " . $conexion->connect_errno);
}else{
    echo("Conexion exitosa");
}
/*
Conexion a base de datos local (Localhost)
$server = "localhost"; // Nombre del host de la base de datos
$user = "root"; // Nombre de usuario de la base de datos
$password = ""; // Contraseña de la base de datos
$dbname = "sistema_ordenes"; // Nombre de la base de datos

$conexion = new mysqli($server, $user, $password, $dbname); */

?>

