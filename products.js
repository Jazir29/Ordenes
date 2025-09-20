document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("productModal");
  const modalTitle = document.getElementById("productModalTitle");
  const addBtn = document.getElementById("addProductBtn");
  const cancelBtn = document.getElementById("cancelProductBtn");
  const form = document.getElementById("productForm");

  const productIdInput = document.getElementById("productId");
  const productNameInput = document.getElementById("productName");
  const productPriceInput = document.getElementById("productPrice");

  // Abrir modal en modo agregar
  addBtn.addEventListener("click", () => {
    modalTitle.textContent = "Agregar producto";
    form.reset();
    productIdInput.value = "";
    modal.classList.remove("hidden");
  });

  // Cerrar modal
  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Editar producto
  document.querySelectorAll(".editBtn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      const id = row.dataset.id;
      const nombre = row.children[1].textContent;
      const precio = row.children[2].textContent;

      modalTitle.textContent = "Editar producto";
      productIdInput.value = id;
      productNameInput.value = nombre;
      productPriceInput.value = parseFloat(precio);
      modal.classList.remove("hidden");
    });
  });

  // Eliminar producto
  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      const id = row.dataset.id;

      if (confirm("¿Seguro que deseas eliminar este producto?")) {
        fetch(`php/delete_product.php?id=${id}`, { method: "GET" })
          .then(res => res.text())
          .then(data => {
            alert(data);
            row.remove();
          })
          .catch(err => console.error(err));
      }
    });
  });

  // Guardar producto (insertar o editar)
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const id = productIdInput.value;
    let url = id ? "php/update_product.php" : "php/add_product.php";

    fetch(url, {
      method: "POST",
      body: formData
    })
      .then(res => res.text())
      .then(data => {
        alert(data);
        location.reload(); // refrescar la lista de productos
      })
      .catch(err => console.error(err));
  });
});
