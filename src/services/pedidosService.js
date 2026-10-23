import {
  crearPedido as bdCrearPedido,
  obtenerPedido as bdObtenerPedido,
  listarPedidos as bdListarPedidos,
  listarPedidosDeUsuario as bdListarPedidosDeUsuario,
  actualizarEstadoPedido as bdActualizarEstadoPedido,
  ESTADOS_PEDIDO as BD_ESTADOS_PEDIDO,
} from "../data/baseDatos.js";

export const ESTADOS_PEDIDO = BD_ESTADOS_PEDIDO;

export function crearPedido(datos) {
  return bdCrearPedido(datos);
}

export function obtenerPedido(numero) {
  return bdObtenerPedido(numero);
}

export function listarPedidos() {
  return bdListarPedidos();
}

export function listarPedidosDeUsuario(usuarioId) {
  return bdListarPedidosDeUsuario(usuarioId);
}

export function actualizarEstadoPedido(numero, nuevoEstado) {
  return bdActualizarEstadoPedido(numero, nuevoEstado);
}
