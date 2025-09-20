<?php
include 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo "Acceso inválido.";
    exit;
}

// recibir items (JSON desde addOrder.js)
$orderItemsJson = $_POST['order_items'] ?? '[]';
$orderIdPost    = trim($_POST['order_id'] ?? '');
$orderStatus    = $_POST['orderStatus'] ?? 'Pendiente';
$items = json_decode($orderItemsJson, true);

if (!is_array($items)) {
    die("Productos inválidos.");
}

// calcular totales
$totalMonto = 0.0;
$totalProductos = 0;       // suma de todas las cantidades
$cantidadProductos = count($items);  // productos distintos

foreach ($items as $it) {
    $cantidad  = intval($it['cantidad'] ?? 0);
    $subtotal  = floatval($it['subtotal'] ?? (floatval($it['precio'] ?? 0) * $cantidad));
    $totalMonto += $subtotal;
    $totalProductos += $cantidad;
}
$totalMonto = round($totalMonto, 2);

// Si se está editando una orden existente
if ($orderIdPost !== '') {
    $orderId = $orderIdPost; // ej. ORDN-...
    
    // actualizar cabecera
    $stmt = $conexion->prepare("
        UPDATE ordenes 
        SET fecha = NOW(), estado = ?, total = ?, cantidad_productos = ?, total_productos = ?
        WHERE id = ?
    ");
    $stmt->bind_param("sddis", $orderStatus, $totalMonto, $cantidadProductos, $totalProductos, $orderId);
    $stmt->execute();
    $stmt->close();

    // borrar items antiguos
    $del = $conexion->prepare("DELETE FROM orden_productos WHERE orden_id = ?");
    $del->bind_param("s", $orderId);
    $del->execute();
    $del->close();

} else {
    // insertar nueva orden: generamos id personalizado ORDN-ddmmyyyyhhmmss
    $orderId = "ORDN-" . date("dmYHis");

    $ins = $conexion->prepare("
        INSERT INTO ordenes (id, fecha, estado, total, cantidad_productos, total_productos) 
        VALUES (?, NOW(), ?, ?, ?, ?)
    ");
    $ins->bind_param("ssddd", $orderId, $orderStatus, $totalMonto, $cantidadProductos, $totalProductos);
    $ins->execute();

    // recuperar numero_orden (AUTO_INCREMENT)
    $numero_orden = $conexion->insert_id;
    $ins->close();
}

// insertar items
$insItem = $conexion->prepare("INSERT INTO orden_productos (orden_id, producto_id, cantidad, subtotal) VALUES (?, ?, ?, ?)");
foreach ($items as $it) {
    $productId = intval($it['id']);
    $cantidad  = intval($it['cantidad']);
    $subtotal  = floatval($it['subtotal']);
    $insItem->bind_param("siid", $orderId, $productId, $cantidad, $subtotal);
    $insItem->execute();
}
$insItem->close();

// redirigir al index
header("Location: ../index.php?success=1&orden={$orderId}");
exit;
