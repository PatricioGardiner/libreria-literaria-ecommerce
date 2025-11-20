// 📦 Utilidades de carrito
const STORAGE_KEY = "mi_carrito";

const getCart = () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
const saveCart = (cart) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
const updateCartCount = () => {
  const count = getCart().reduce((acc, item) => acc + item.cantidad, 0);
  document
    .querySelectorAll("#cart-count")
    .forEach((el) => (el.textContent = count));
};

// 🛍️ Renderizar productos desde productos.json
async function loadProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;

  try {
    const res = await fetch("data/productos.json");
    const productos = await res.json();

    container.innerHTML = productos
      .map(
        (p) => `
      <div class="card product-card shadow">
        <img src="${p.imagen}" class="card-img-top" alt="${p.titulo}">
        <div class="card-body">
          <h5 class="card-title">${p.titulo}</h5>
          <p class="card-text">$${p.precio.toLocaleString("es-AR")}</p>
          <button class="btn btn-warning" data-id="${
            p.id
          }">Agregar al carrito</button>
        </div>
      </div>
    `
      )
      .join("");

    container.addEventListener("click", (e) => {
      if (e.target.matches("button[data-id]")) {
        const id = Number(e.target.dataset.id);
        const producto = productos.find((p) => p.id === id);
        addToCart(producto);
      }
    });
  } catch (error) {
    container.innerHTML = `<div class="alert alert-danger">Error al cargar productos.</div>`;
  }
}

// ➕ Agregar al carrito
function addToCart(producto) {
  const cart = getCart();
  const item = cart.find((p) => p.id === producto.id);
  if (item) {
    item.cantidad += 1;
  } else {
    cart.push({ ...producto, cantidad: 1 });
  }
  saveCart(cart);
  updateCartCount();
}

// 🧾 Renderizar carrito
function renderCart() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  if (!container || !totalEl) return;

  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = `<div class="alert alert-info">Tu carrito está vacío.</div>`;
    totalEl.textContent = "$0";
    return;
  }

  container.innerHTML = cart
    .map(
      (item) => `
    <div class="list-group-item d-flex align-items-center gap-3">
      <img src="${item.imagen}" alt="${
        item.titulo
      }" width="64" height="64" style="object-fit:cover;border-radius:6px;">
      <div class="flex-grow-1">
        <p class="mb-1 fw-medium">${item.titulo}</p>
        <small>Precio: $${item.precio.toLocaleString("es-AR")}</small>
      </div>
      <div class="d-flex align-items-center gap-2">
        <input type="number" min="1" class="form-control" style="width:80px" value="${
          item.cantidad
        }" data-id="${item.id}">
        <button class="btn btn-outline-danger" data-remove="${
          item.id
        }">Eliminar</button>
      </div>
    </div>
  `
    )
    .join("");

  const total = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
  totalEl.textContent = `$${total.toLocaleString("es-AR")}`;
}

// 🧠 Eventos del carrito
function attachCartEvents() {
  const container = document.getElementById("cart-items");
  const clearBtn = document.getElementById("clear-cart");
  const checkoutBtn = document.getElementById("checkout");
  const msg = document.getElementById("cart-msg");

  if (!container) return;

  container.addEventListener("input", (e) => {
    if (e.target.matches("input[data-id]")) {
      const id = Number(e.target.dataset.id);
      const qty = Math.max(1, Number(e.target.value));
      const cart = getCart();
      const item = cart.find((p) => p.id === id);
      if (item) {
        item.cantidad = qty;
        saveCart(cart);
        renderCart();
        updateCartCount();
      }
    }
  });

  container.addEventListener("click", (e) => {
    if (e.target.matches("button[data-remove]")) {
      const id = Number(e.target.dataset.remove);
      const cart = getCart().filter((p) => p.id !== id);
      saveCart(cart);
      renderCart();
      updateCartCount();
    }
  });

  clearBtn?.addEventListener("click", () => {
    saveCart([]);
    renderCart();
    updateCartCount();
    msg.textContent = "Carrito vaciado.";
  });

  checkoutBtn?.addEventListener("click", () => {
    const cart = getCart();
    if (cart.length === 0) {
      msg.textContent = "Tu carrito está vacío.";
      return;
    }
    saveCart([]);
    renderCart();
    updateCartCount();
    msg.textContent = "¡Compra simulada con éxito!";
  });
}

// ✅ Validación de formulario
function attachContactValidation() {
  const form = document.getElementById("contact-form");
  const msg = document.getElementById("form-msg");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    let valid = true;
    ["nombre", "email", "mensaje"].forEach((id) => {
      const field = document.getElementById(id);
      if (!field.value.trim()) {
        field.classList.add("is-invalid");
        valid = false;
      } else {
        field.classList.remove("is-invalid");
      }
    });

    const email = document.getElementById("email").value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      document.getElementById("email").classList.add("is-invalid");
      valid = false;
    }

    if (!valid) {
      e.preventDefault();
      msg.textContent = "Revisá los campos marcados.";
    } else {
      msg.textContent = "Enviando...";
    }
  });
}

// 🚀 Inicialización por página
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  loadProducts();
  renderCart();
  attachCartEvents();
  attachContactValidation();
});
