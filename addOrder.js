let orders = JSON.parse(localStorage.getItem("orders")) || [];
let products = [];
let editOrderId = null;

let availableProducts = JSON.parse(localStorage.getItem("availableProducts")) || [];

const urlParams = new URLSearchParams(window.location.search);
editOrderId = urlParams.get("id");

const formTitle = document.getElementById("formTitle");
const orderNumber = document.getElementById("orderNumber");
const orderDate = document.getElementById("orderDate");
const orderProducts = document.getElementById("orderProducts");
const orderPrice = document.getElementById("orderPrice");
const productsTableBody = document.getElementById("productsTableBody");
const saveOrderBtn = document.getElementById("saveOrderBtn");
const productModal = document.getElementById("productModal");
const productModalTitle = document.getElementById("productModalTitle");
const productSelect = document.getElementById("productSelect");
const productQty = document.getElementById("productQty");
const confirmProductBtn = document.getElementById("confirmProductBtn");
const cancelProductBtn = document.getElementById("cancelProductBtn");



// Calcular siguiente número de orden disponible (rellena huecos)
function getNextOrderNumber() {
  if (orders.length === 0) return 1;

  const usedNumbers = orders.map(o => parseInt(o.orderNumber)).sort((a, b) => a - b);

  let nextNumber = 1;
  for (let num of usedNumbers) {
    if (num === nextNumber) {
      nextNumber++;
    } else {
      break;
    }
  }
  return nextNumber;
}

// ---------------------- MANEJO DE PRODUCTOS ----------------------

// Abrir modal para agregar producto
document.getElementById("addProductBtn").addEventListener("click", () => {
  productModalTitle.textContent = "Agregar Producto";
  productQty.value = 1;
  productSelect.selectedIndex = 0;
  productModal.classList.remove("hidden");
});

// Cancelar modal
cancelProductBtn.addEventListener("click", () => {
  productModal.classList.add("hidden");
});

// Cargar productos en el <select>
function loadProductsIntoSelect() {
  productSelect.innerHTML = "";

  if (availableProducts.length === 0) {
    const option = document.createElement("option");
    option.textContent = "No hay productos disponibles";
    option.disabled = true;
    option.selected = true;
    productSelect.appendChild(option);
    return;
  }

  availableProducts.forEach(p => {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = `${p.name} - S/ ${p.price}`;
    productSelect.appendChild(option);
  });
}

// Confirmar producto agregado/editado
confirmProductBtn.addEventListener("click", () => {
  const productId = productSelect.value;
  const selectedProduct = availableProducts.find(p => p.id === productId);
  const qty = parseInt(productQty.value);

  if (!selectedProduct || qty < 1) return;

  const existing = products.find(p => p.id === productId);
  if (existing) {
    existing.qty = qty;
    existing.total = qty * selectedProduct.price;
  } else {
    products.push({
      id: selectedProduct.id,
      name: selectedProduct.name,
      unitPrice: selectedProduct.price,
      qty: qty,
      total: qty * selectedProduct.price
    });
  }

  updateProductsTable();
  productModal.classList.add("hidden");
});

// Actualizar tabla de productos
function updateProductsTable() {
  productsTableBody.innerHTML = "";
  products.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>S/ ${p.unitPrice}</td>
      <td>${p.qty}</td>
      <td>S/ ${p.total}</td>
      <td>
        <button onclick="editProduct('${p.id}')">Editar</button>
        <button class="danger" onclick="removeProduct('${p.id}')">Eliminar</button>
      </td>
    `;
    productsTableBody.appendChild(row);
  });

  orderProducts.value = products.length;
  orderPrice.value = "S/ " + products.reduce((acc, p) => acc + p.total, 0);
}

// Editar producto
function editProduct(id) {
  const p = products.find(prod => prod.id === id);
  if (!p) return;

  productSelect.value = p.id;
  productQty.value = p.qty;
  productModalTitle.textContent = "Editar Producto";
  productModal.classList.remove("hidden");
}

// Eliminar producto
function removeProduct(id) {
  products = products.filter(p => p.id !== id);
  updateProductsTable();
}

// ---------------------- MANEJO DE ÓRDENES ----------------------

const orderStatus = document.getElementById("orderStatus");

// Guardar orden
saveOrderBtn.addEventListener("click", () => {
  const newOrder = {
    id: editOrderId ? parseInt(editOrderId) : Date.now(),
    orderNumber: parseInt(orderNumber.value),
    date: orderDate.value,
    products: products,
    finalPrice: products.reduce((acc, p) => acc + p.total, 0),
    status: orderStatus.value
  };

  if (editOrderId) {
    orders = orders.map(o => (o.id == editOrderId ? newOrder : o));
  } else {
    orders.push(newOrder);
  }

  localStorage.setItem("orders", JSON.stringify(orders));
  window.location.href = "index.html";
});

// Inicialización
function init() {
  orderDate.value = new Date().toLocaleDateString();
  loadProductsIntoSelect();

  // Editar orden existente
  if (editOrderId) {
    formTitle.textContent = "Editar Orden";
    const order = orders.find(o => o.id == editOrderId);
    if (order) {
      orderNumber.value = order.orderNumber;
      orderDate.value = order.date;
      products = order.products;
      updateProductsTable();
      orderProducts.value = products.length;
      orderPrice.value = "S/ " + order.finalPrice;
      orderStatus.value = order.status || "Pendiente";
    }
  } else {
    // Crear nueva orden
    formTitle.textContent = "Agregar Orden";
    orderNumber.value = getNextOrderNumber();
    orderStatus.value = "Pendiente"; // valor por defecto
  }
}

//Redirigir a productos
const viewProductsBtn = document.getElementById("viewProductsBtn");
viewProductsBtn.addEventListener("click", () => {
  window.location.href = "products.html";
});

init();
