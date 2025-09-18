let orders = JSON.parse(localStorage.getItem("orders")) || [];
let orderToDelete = null;

const ordersTableBody = document.getElementById("ordersTableBody");
const addOrderBtn = document.getElementById("addOrderBtn");
const deleteModal = document.getElementById("deleteModal");
const confirmDelete = document.getElementById("confirmDelete");
const cancelDelete = document.getElementById("cancelDelete");

function renderOrders() {
  ordersTableBody.innerHTML = "";
  orders.forEach(order => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.orderNumber}</td>
      <td>${order.date}</td>
      <td>${order.products.length}</td>
      <td>S/ ${order.finalPrice}</td>
      <td>${order.status || "Pendiente"}</td>
      <td>
        <button onclick="editOrder(${order.id})">Editar</button>
        <button class="danger" onclick="openDeleteModal(${order.id})">Eliminar</button>
      </td>
    `;
    ordersTableBody.appendChild(row);
  });
}

function editOrder(id) {
  window.location.href = `add-order.html?id=${id}`;
}

function openDeleteModal(id) {
  orderToDelete = id;
  deleteModal.classList.remove("hidden");
}

confirmDelete.addEventListener("click", () => {
  orders = orders.filter(o => o.id !== orderToDelete);
  localStorage.setItem("orders", JSON.stringify(orders));
  renderOrders();
  deleteModal.classList.add("hidden");
});

cancelDelete.addEventListener("click", () => {
  deleteModal.classList.add("hidden");
});

addOrderBtn.addEventListener("click", () => {
  window.location.href = "add-order.html";
});

renderOrders();

