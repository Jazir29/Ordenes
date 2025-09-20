<?php
include 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? '';
    $nombre = $_POST['nombre'] ?? '';
    $precio = $_POST['precio'] ?? 0;

    if (!empty($id) && !empty($nombre) && $precio > 0) {
        $stmt = $conexion->prepare("UPDATE productos SET nombre=?, precio=? WHERE id=?");
        $stmt->bind_param("sdi", $nombre, $precio, $id);

        if ($stmt->execute()) {
            echo "Producto actualizado correctamente.";
        } else {
            echo "Error al actualizar el producto: " . $conexion->error;
        }

        $stmt->close();
    } else {
        echo "Datos inválidos.";
    }
}
?>
