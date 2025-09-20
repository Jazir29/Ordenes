<?php
// Conexión a la base de datos
include 'php/conexion.php';

// Consultar productos
$sql = "SELECT id, nombre, precio FROM productos";
$result = $conexion->query($sql);
$productos = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Productos</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>Productos</h1>
  </header>

  <main>
    <button id="addProductBtn">Agregar Producto</button>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Precio unit.</th>
          <th>Opciones</th>
        </tr>
      </thead>
      <tbody id="productsListTable">
        <?php foreach ($productos as $producto): ?>
          <tr data-id="<?= $producto['id'] ?>">
            <td><?= $producto['id'] ?></td>
            <td><?= htmlspecialchars($producto['nombre']) ?></td>
            <td>S/ <?= number_format($producto['precio'], 2) ?></td>
            <td>
              <button class="editBtn">Editar</button>
              <button class="deleteBtn danger">Eliminar</button>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>

    <button class="danger" onclick="window.history.back()">Volver</button>
  </main>

  <!-- Modal para Agregar/Editar -->
  <div id="productModal" class="modal hidden">
    <div class="modal-content">
      <h3 id="productModalTitle">Agregar producto</h3>

      <form id="productForm">
        <input type="hidden" id="productId">

        <label for="productName">Nombre</label>
        <input type="text" id="productName" name="nombre" required>

        <label for="productPrice">Precio unit.</label>
        <input type="number" id="productPrice" name="precio" min="1" required>

        <button type="submit" id="confirmProductBtn">Confirmar</button>
        <button type="button" class="danger" id="cancelProductBtn">Cancelar</button>
      </form>
    </div>
  </div>

  <script src="products.js"></script>
</body>
</html>
