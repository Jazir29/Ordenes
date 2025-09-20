document.addEventListener("DOMContentLoaded", () => {
  const addProductBtn = document.getElementById("addProductBtn");
  const productModal = document.getElementById("productModal");
  const confirmProductBtn = document.getElementById("confirmProductBtn");
  const cancelProductBtn = document.getElementById("cancelProductBtn");
  const productSelect = document.getElementById("productSelect");
  const productQty = document.getElementById("productQty");
  const productsTableBody = document.getElementById("productsTableBody");
  const orderItemsInput = document.getElementById("orderItemsInput");
  const orderProducts = document.getElementById("orderProducts");
  const orderPrice = document.getElementById("orderPrice");
  const saveOrderBtn = document.getElementById("saveOrderBtn");
  const orderForm = document.getElementById("orderForm");
  const productModalTitle = document.getElementById("productModalTitle");

  let itemsState = Array.isArray(window.initialItems) ? window.initialItems.slice() : [];
  let editingIndex = null; // null = agregar, número = índice que se edita

  // Abrir modal para agregar
  addProductBtn.addEventListener("click", () => {
    editingIndex = null;
    productModalTitle.textContent = "Agregar producto";
    productSelect.disabled = false; // se puede elegir producto
    productSelect.selectedIndex = 0;
    productQty.value = 1;
    productModal.classList.remove("hidden");
  });

  // Cancelar modal
  cancelProductBtn.addEventListener("click", () => {
    productModal.classList.add("hidden");
    productQty.value = 1;
    editingIndex = null;
  });

  // Confirmar producto (agregar o editar)
  confirmProductBtn.addEventListener("click", () => {
    const selectedOption = productSelect.options[productSelect.selectedIndex];
    if (!selectedOption) {
      alert("Selecciona un producto.");
      return;
    }

    const productId = parseInt(selectedOption.value, 10);
    const nombre = selectedOption.dataset.nombre || selectedOption.textContent.trim(); // solo nombre
    const precio = parseFloat(selectedOption.dataset.precio);
    const cantidad = Math.max(1, parseInt(productQty.value, 10) || 1);
    const subtotal = +(precio * cantidad).toFixed(2);

    if (editingIndex !== null) {
      // EDITAR
      const item = itemsState[editingIndex];
      item.cantidad = cantidad;
      item.subtotal = +(item.precio * item.cantidad).toFixed(2);
    } else {
      // AGREGAR
      const existing = itemsState.find(item => Number(item.id) === productId);
      if (existing) {
        existing.cantidad += cantidad;
        existing.subtotal = +(existing.precio * existing.cantidad).toFixed(2);
      } else {
        itemsState.push({
          id: productId,
          nombre, // solo nombre
          precio,
          cantidad,
          subtotal
        });
      }
    }

    productQty.value = 1;
    productModal.classList.add("hidden");
    editingIndex = null;
    renderProducts();
  });

  // Renderizar tabla
  function renderProducts() {
    productsTableBody.innerHTML = "";
    let totalSum = 0;
    let totalCantidad = 0;

    itemsState.forEach((item, idx) => {
      totalSum += Number(item.subtotal);
      totalCantidad += Number(item.cantidad);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(String(item.id))}</td>
        <td>${escapeHtml(item.nombre)}</td>
        <td>S/ ${Number(item.precio).toFixed(2)}</td>
        <td>${item.cantidad}</td>
        <td>S/ ${Number(item.subtotal).toFixed(2)}</td>
        <td>
          <button class="editBtn" data-idx="${idx}">Editar</button>
          <button class="danger removeBtn" data-idx="${idx}">Eliminar</button>
        </td>
      `;
      productsTableBody.appendChild(tr);
    });

    // enlazar eliminar
    productsTableBody.querySelectorAll('.removeBtn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const i = parseInt(e.currentTarget.dataset.idx, 10);
        itemsState.splice(i, 1);
        renderProducts();
      });
    });

    // enlazar editar
    productsTableBody.querySelectorAll('.editBtn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        editingIndex = parseInt(e.currentTarget.dataset.idx, 10);
        const item = itemsState[editingIndex];
        productModalTitle.textContent = "Editar producto";
        productSelect.value = item.id;
        productSelect.disabled = true; // no dejar cambiar producto
        productQty.value = item.cantidad;
        productModal.classList.remove("hidden");
      });
    });

    orderProducts.value = totalCantidad;
    orderPrice.value = 'S/ ' + Number(totalSum).toFixed(2);
  }

  // Guardar orden
  saveOrderBtn.addEventListener("click", () => {
    if (itemsState.length === 0) {
      if (!confirm("La orden no tiene productos. ¿Deseas guardar igual?")) return;
    }
    orderItemsInput.value = JSON.stringify(itemsState);
    orderForm.submit();
  });

  // Escapar HTML
  function escapeHtml(text) {
    if (!text) return '';
    return String(text).replace(/[&<>"']/g, m => ({
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      '"':'&quot;',
      "'":'&#39;'
    })[m]);
  }

  // Inicializar tabla si venimos editando
  renderProducts();
});
