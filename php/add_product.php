<?php
include 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre'] ?? '';
    $precio = $_POST['precio'] ?? 0;

    if (!empty($nombre) && $precio > 0) {
        $stmt = $conexion->prepare("INSERT INTO productos (nombre, precio) VALUES (?, ?)");
        $stmt->bind_param("sd", $nombre, $precio);

        if ($stmt->execute()) {
            echo "Producto agregado correctamente.";
        } else {
            echo "Error al agregar el producto: " . $conexion->error;
        }

        $stmt->close();
    } else {
        echo "Datos inválidos.";
    }
}
?>
