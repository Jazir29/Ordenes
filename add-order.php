<?php
include 'php/conexion.php';

// Si editas una orden (opcional) cargamos datos y items existentes
$orderData = null;
$initialItems = [];
if (isset($_GET['id']) && $_GET['id'] !== '') {
    $orderId = $conexion->real_escape_string($_GET['id']);
    $q = $conexion->query("SELECT * FROM ordenes WHERE id = '{$orderId}' LIMIT 1");
    if ($q && $q->num_rows) $orderData = $q->fetch_assoc();

    // cargar items existentes para edición
    $stmt = $conexion->prepare("
      SELECT op.producto_id AS id, p.nombre, p.precio, op.cantidad, op.subtotal
      FROM orden_productos op
      JOIN productos p ON p.id = op.producto_id
      WHERE op.orden_id = ?
    ");
    $stmt->bind_param("s", $orderId);
    $stmt->execute();
    $res = $stmt->get_result();
    while ($r = $res->fetch_assoc()) {
        $r['precio'] = floatval($r['precio']);
        $r['cantidad'] = intval($r['cantidad']);
        $r['subtotal'] = floatval($r['subtotal']);
        $initialItems[] = $r;
    }
    $stmt->close();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?= $orderData ? "Editar Orden" : "Crear Orden" ?></title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header><h1 id="formTitle"><?= $orderData ? "Editar Orden" : "Crear Orden" ?></h1></header>
  <main>
    <form id="orderForm" method="POST" action="php/save-order.php">
      <input type="hidden" name="order_id" id="orderId" value="<?= htmlspecialchars($orderData['id'] ?? '') ?>">
      <input type="hidden" name="order_items" id="orderItemsInput">

      <label>N° Orden</label>
      <input type="text" name="orderNumber" id="orderNumber"
             value="<?= htmlspecialchars($orderData['numero_orden'] ?? '') ?>" readonly />

      <label>Fecha</label>
      <input type="text" name="orderDate" id="orderDate"
             value="<?= htmlspecialchars($orderData['fecha'] ?? date('Y-m-d H:i:s')) ?>" readonly />

      <label>N° Productos</label>
      <input type="text" id="orderProducts" disabled />

      <label>Total</label>
      <input type="text" id="orderPrice" disabled />

      <label>Estado</label>
      <select name="orderStatus" id="orderStatus">
        <option value="Pendiente" <?= (($orderData['estado'] ?? '') == "Pendiente") ? 'selected' : '' ?>>Pendiente</option>
        <option value="Procesando" <?= (($orderData['estado'] ?? '') == "Procesando") ? 'selected' : '' ?>>Procesando</option>
        <option value="Completada" <?= (($orderData['estado'] ?? '') == "Completada") ? 'selected' : '' ?>>Completada</option>
        <option value="Cancelada" <?= (($orderData['estado'] ?? '') == "Cancelada") ? 'selected' : '' ?>>Cancelada</option>
      </select>

      <button type="button" id="addProductBtn">Agregar producto</button>
      <button class="danger" onclick="window.history.back()">Volver</button>
    </form>

    <section>
      <h2>Productos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio unit.</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody id="productsTableBody"></tbody>
      </table>
    </section>

    <div style="margin-top:12px;">
      <button id="saveOrderBtn">Guardar Orden</button>
      <a href="products.php"><button id="viewProductsBtn" type="button">Ver productos</button></a>
    </div>
  </main>

  <!-- Modal productos -->
  <div id="productModal" class="modal hidden">
    <div class="modal-content">
      <h3 id="productModalTitle">Agregar producto</h3>

      <label for="productSelect">Producto</label>
      <select id="productSelect">
        <?php
        $result = $conexion->query("SELECT id, nombre, precio FROM productos");
        while ($row = $result->fetch_assoc()) {
          echo "<option value='{$row['id']}' data-nombre='{$row['nombre']}' data-precio='{$row['precio']}'>
          {$row['nombre']} ({$row['precio']})
          </option>";
        }
        ?>
      </select>

      <label for="productQty">Cantidad</label>
      <input type="number" id="productQty" min="1" value="1" />

      <div style="margin-top:10px;">
        <button id="confirmProductBtn">Confirmar</button>
        <button class="danger" id="cancelProductBtn">Cancelar</button>
      </div>
    </div>
  </div>

  <!-- pasamos items iniciales al JS -->
  <script>
    window.initialItems = <?= json_encode($initialItems, JSON_HEX_TAG|JSON_HEX_APOS|JSON_HEX_QUOT) ?>;
  </script>

  <script src="addOrder.js"></script>
</body>
</html>
