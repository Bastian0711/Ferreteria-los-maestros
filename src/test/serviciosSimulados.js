// Versiones de productosService y pedidosService que usan la base simulada del navegador
// (data/baseDatos.js) en vez de la API. setupTests.js las usa en todas las pruebas,
// para que las pantallas se prueben sin necesidad de tener el backend encendido.
import * as bd from "../data/baseDatos";
import { leerSesion } from "../services/sesion";

function sesionActual() {
  const sesion = leerSesion();
  return sesion ? sesion.usuario : null;
}

function errorConEstado(mensaje, status) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

export const productosSimulados = {
  catalogoEnCache: () => ({ productos: bd.listarProductos(), categorias: bd.listarCategorias() }),
  listarProductos: async () => bd.listarProductos(),
  listarCategorias: async () => bd.listarCategorias(),
  obtenerProducto: async (codigo) => {
    const producto = bd.obtenerProducto(codigo);
    if (!producto) throw errorConEstado("Producto no encontrado.", 404);
    return producto;
  },
  crearProducto: async (datos) => bd.crearProducto(datos),
  actualizarProducto: async (codigo, datos) => bd.actualizarProducto(codigo, datos),
  eliminarProducto: async (codigo) => bd.eliminarProducto(codigo),
};

export const pedidosSimulados = {
  crearPedido: async ({ items, entrega }) => {
    const usuario = sesionActual();
    return bd.crearPedido({
      usuario,
      items,
      entrega,
      datosCliente: usuario
        ? { nombre: usuario.nombre, apellidos: usuario.apellidos, correo: usuario.correo }
        : {},
    });
  },
  obtenerPedido: async (numero) => {
    const pedido = bd.obtenerPedido(numero);
    if (!pedido) throw errorConEstado("No encontramos la solicitud.", 404);
    const usuario = sesionActual();
    const esPersonal = usuario && (usuario.rol === "admin" || usuario.rol === "vendedor");
    if (!usuario || (!esPersonal && pedido.usuarioId !== usuario.id)) {
      throw errorConEstado("No puedes acceder a pedidos de otra persona.", 403);
    }
    return pedido;
  },
  listarPedidos: async () => {
    const usuario = sesionActual();
    const todos = [...bd.listarPedidos()].reverse();
    const esPersonal = usuario && (usuario.rol === "admin" || usuario.rol === "vendedor");
    return esPersonal ? todos : todos.filter((p) => usuario && p.usuarioId === usuario.id);
  },
  cambiarEstadoPedido: async (numero, estado) => bd.actualizarEstadoPedido(numero, estado),
};
