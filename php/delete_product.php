<?php
include 'conexion.php';

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);

    if ($id > 0) {
        $stmt = $conexion->prepare("DELETE FROM productos WHERE id=?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo "Producto eliminado correctamente.";
        } else {
            echo "Error al eliminar el producto: " . $conexion->error;
        }

        $stmt->close();
    } else {
        echo "ID inválido.";
    }
}
?>
