import {
  listarProductos as bdListarProductos,
  obtenerProducto as bdObtenerProducto,
  crearProducto as bdCrearProducto,
  actualizarProducto as bdActualizarProducto,
  eliminarProducto as bdEliminarProducto,
  listarProductosCriticos as bdListarProductosCriticos,
  listarCategorias as bdListarCategorias,
  precioFinal as bdPrecioFinal,
  suscribir,
} from "../data/baseDatos.js";

export function listarProductos() {
  return bdListarProductos();
}

export function obtenerProducto(codigo) {
  return bdObtenerProducto(codigo);
}

export function crearProducto(datos) {
  return bdCrearProducto(datos);
}

export function actualizarProducto(codigo, cambios) {
  return bdActualizarProducto(codigo, cambios);
}

export function eliminarProducto(codigo) {
  return bdEliminarProducto(codigo);
}

export function listarProductosCriticos() {
  return bdListarProductosCriticos();
}

export function listarProductosEnOferta() {
  return bdListarProductos().filter((p) => p.oferta);
}

export function listarProductosDestacados() {
  return bdListarProductos().filter((p) => p.destacado);
}

export function listarCategorias() {
  return bdListarCategorias();
}

export function precioFinal(producto) {
  return bdPrecioFinal(producto);
}

// Avisa cada vez que los datos cambian
export function suscribirCambios(callback) {
  return suscribir(callback);
}
