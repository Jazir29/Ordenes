<?php
// incluir la conexión desde la carpeta php
include 'php/conexion.php';
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mis órdenes</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>Mis órdenes</h1>
  </header>
  <main>
    <section>
      <!-- Botón para crear una nueva orden -->
      <a href="add-order.php">
        <button id="addOrderBtn">Crear orden</button>
      </a>

      <!-- Tabla de órdenes -->
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>N° Orden</th>
            <th>Fecha</th>
            <th>Cantidad de Productos</th>
            <th>Total de Productos</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          <?php
          // Consultar todas las órdenes
          $sql = "SELECT * FROM ordenes ORDER BY id DESC";
          $result = $conexion->query($sql);

          if ($result && $result->num_rows > 0) {
              while ($row = $result->fetch_assoc()) {
                  echo "<tr>";
                  echo "<td>" . $row['id'] . "</td>";
                  echo "<td>" . $row['numero_orden'] . "</td>";
                  echo "<td>" . $row['fecha'] . "</td>";
                  echo "<td>" . $row['cantidad_productos'] . "</td>";
                  echo "<td>" . $row['total_productos'] . "</td>";
                  echo "<td>S/ " . number_format($row['total'], 2) . "</td>";
                  echo "<td>" . $row['estado'] . "</td>";
                  echo "<td>
                          <a href='add-order.php?id=" . $row['id'] . "'><button>Editar</button></a>                          

                          <a href='php/delete-order.php?id=" . $row['id'] . "' onclick=\"return confirm('¿Seguro que deseas eliminar esta orden?');\"><button class='danger'>Eliminar</button></a>
                        </td>";
                  echo "</tr>";
              }
          } else {
              echo "<tr><td colspan='6'>No hay órdenes registradas</td></tr>";
          }
          ?>
        </tbody>
      </table>
    </section>
  </main>
</body>
</html>
