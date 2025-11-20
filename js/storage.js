const KEY = "carrito";

export const guardarCarrito = (carrito) => {
  //Convertimos a json antes de guardar con stringify
  localStorage.setItem(KEY, JSON.stringify(carrito));
};

export const obtenerCarrito = () => {
  const carritoJSON = localStorage.getItem(KEY);
  //convertimos a js para obtener los datos con parse
  return carritoJSON ? JSON.parse(carritoJSON) : [];
};

export const vaciarCarritoStorage = () => {
  localStorage.removeItem(KEY);
};
