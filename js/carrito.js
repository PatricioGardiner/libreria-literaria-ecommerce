import { obtenerCarrito } from "./storage.js";
import { eliminarProducto, vaciarCarrito } from "./funcionesCarrito.js";
import { actualizarContador } from "./ui.js";

const renderizarCarrito = () => {
  // Leemos cantidad de productos en carrito para mostrar
  const carrito = obtenerCarrito();
  actualizarContador(carrito);

  // Nodso donde vamos a mostrar las tarjetas y acciones
  const contenedor = document.getElementById("contenedor-carrito");
  const divAcciones = document.getElementById("acciones-carrito");
  const resumen = document.getElementById("resumen-carrito"); // <--- Total aquí

  // Limpiamos contenedores antes de renderizar
  contenedor.innerHTML = "";
  divAcciones.innerHTML = "";
  resumen.innerHTML = "";

  // ❌ Si no hay productos
  if (!carrito.length) {
    const mensaje = document.createElement("p");
    mensaje.classList.add("mensaje-carrito-vacio");
    mensaje.textContent = "No hay productos en el carrito";
    contenedor.appendChild(mensaje);
    return;
  }

  // --- NUEVO: calcular total ---
  let total = 0;
  carrito.forEach((producto) => {
    total += producto.precio;
  });

  // Mostrar total en el resumen
  const divTotal = document.createElement("div");
  divTotal.id = "total-carrito";
  divTotal.textContent = `Total: $${total}`;
  divTotal.classList.add("total-carrito-resumen"); // para CSS
  resumen.appendChild(divTotal);

  // ✅ Renderizamos los productos
  carrito.forEach((producto, indice) => {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta-producto");

    const img = document.createElement("img");
    img.src = `../${producto.img}`;
    img.alt = producto.nombre;

    const titulo = document.createElement("h3");
    titulo.textContent = producto.nombre;

    const precio = document.createElement("p");
    precio.textContent = `$${producto.precio}`;

    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("btn", "btn-eliminar-carrito");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", () => {
      eliminarProducto(indice);
      renderizarCarrito();
    });

    tarjeta.appendChild(img);
    tarjeta.appendChild(titulo);
    tarjeta.appendChild(precio);
    tarjeta.appendChild(btnEliminar);

    contenedor.appendChild(tarjeta);
  });

  // Botón Vaciar carrito
  const btnVaciar = document.createElement("button");
  btnVaciar.classList.add("btn", "btn-vaciar-carrito");
  btnVaciar.textContent = "Vaciar carrito";
  btnVaciar.addEventListener("click", () => {
    vaciarCarrito();
    renderizarCarrito();
  });

  divAcciones.appendChild(btnVaciar);
};

// Ejecutamos cuando el DOM está listo
document.addEventListener("DOMContentLoaded", renderizarCarrito);
