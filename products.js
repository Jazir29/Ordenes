// Cargar productos desde localStorage o inicializar
let availableProducts = JSON.parse(localStorage.getItem("availableProducts")) || [
  { id: "1", name: "CPU", price: 1500 },
  { id: "2", name: "Monitor", price: 750 },
  { id: "3", name: "Teclado", price: 120 },
  { id: "4", name: "Mouse", price: 75 },
  { id: "5", name: "Audifonos", price: 70 }
];

const productsListTable = document.getElementById("productsListTable");
const addProductBtn = document.getElementById("addProductBtn");
const productModal = document.getElementById("productModal");
const productModalTitle = document.getElementById("productModalTitle");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const confirmProductBtn = document.getElementById("confirmProductBtn");
const cancelProductBtn = document.getElementById("cancelProductBtn");

let editProductId = null;

// Renderizar productos
function renderProducts() {
  productsListTable.innerHTML = "";
  availableProducts.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>S/ ${p.price}</td>
      <td>
        <button onclick="editProduct('${p.id}')">Editar</button>
        <button class="danger" onclick="deleteProduct('${p.id}')">Eliminar</button>
      </td>
    `;
    productsListTable.appendChild(row);
  });
}

// Abrir modal para agregar
addProductBtn.addEventListener("click", () => {
  editProductId = null;
  productModalTitle.textContent = "Agregar Producto";
  productName.value = "";
  productPrice.value = "";
  productModal.classList.remove("hidden");
});

// Confirmar guardar producto
confirmProductBtn.addEventListener("click", () => {
  const name = productName.value.trim();
  const price = parseFloat(productPrice.value);

  if (!name || price <= 0) return;

  if (editProductId) {
    // Editar producto existente
    availableProducts = availableProducts.map(p =>
      p.id === editProductId ? { ...p, name, price } : p
    );
  } else {
    // Nuevo producto
    const newId = (Math.max(0, ...availableProducts.map(p => parseInt(p.id))) + 1).toString();
    availableProducts.push({ id: newId, name, price });
  }

  saveProducts();
  renderProducts();
  productModal.classList.add("hidden");
});

// Cancelar modal
cancelProductBtn.addEventListener("click", () => {
  productModal.classList.add("hidden");
});

// Editar producto
function editProduct(id) {
  const product = availableProducts.find(p => p.id === id);
  if (!product) return;

  editProductId = id;
  productModalTitle.textContent = "Editar Producto";
  productName.value = product.name;
  productPrice.value = product.price;
  productModal.classList.remove("hidden");
}

// Eliminar producto
function deleteProduct(id) {
  availableProducts = availableProducts.filter(p => p.id !== id);
  saveProducts();
  renderProducts();
}

// Guardar en localStorage
function saveProducts() {
  localStorage.setItem("availableProducts", JSON.stringify(availableProducts));
}

// Inicializar
renderProducts();

