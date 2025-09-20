<?php
include 'conexion.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];

    try {
        $conexion->begin_transaction();

        // Eliminar primero los productos de la orden (por si no tienes ON DELETE CASCADE)
        $stmt = $conexion->prepare("DELETE FROM orden_productos WHERE orden_id = ?");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        $stmt->close();

        // Ahora eliminar la orden
        $stmt2 = $conexion->prepare("DELETE FROM ordenes WHERE id = ?");
        $stmt2->bind_param("s", $id);
        $stmt2->execute();
        $stmt2->close();

        $conexion->commit();

        header("Location: ../index.php?deleted=1");
        exit;
    } catch (Exception $e) {
        $conexion->rollback();
        error_log("Error al eliminar orden: " . $e->getMessage());
        header("Location: ../index.php?error=delete_failed");
        exit;
    }
} else {
    header("Location: ../index.php?error=missing_id");
    exit;
}
