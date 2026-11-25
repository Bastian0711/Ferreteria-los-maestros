import { apiCatalogo, mensajeDeError } from "./api";

export { ESTADOS_PEDIDO, ESTADO_ANULADO, siguienteEstado } from "../utils/estadosPedido";

// Convierte un pedido de ms-catalogo a la forma que usan las pantallas
export function adaptarPedido(p) {
  return {
    id: p.id,
    numero: p.numero,
    fecha: p.fecha,
    estado: p.estado,
    entrega: { tipo: p.tipoEntrega, direccion: p.direccionDespacho || "" },
    pago: p.condicionPago,
    total: p.total,
    usuarioId: p.idUsuario,
    items: (p.items || []).map((item) => ({ ...item })),
  };
}

async function pedir(promesa, porDefecto) {
  try {
    const { data } = await promesa;
    return data;
  } catch (error) {
    const fallo = new Error(mensajeDeError(error, porDefecto));
    fallo.status = error.response ? error.response.status : 0;
    throw fallo;
  }
}

// POST /pedidos. El backend calcula precios, total, condición de pago y usuario (desde el token).
// Si no hay stock suficiente, responde 409 y el mensaje trae el detalle.
export async function crearPedido({ items, entrega }) {
  const cuerpo = {
    items: items.map((item) => ({ codigo: item.codigo, cantidad: item.cantidad })),
    tipoEntrega: entrega.tipo,
    direccionDespacho: entrega.tipo === "despacho" ? entrega.direccion : null,
  };
  return adaptarPedido(await pedir(apiCatalogo.post("/pedidos", cuerpo), "No pudimos registrar tu solicitud."));
}

// El dueño, un admin o un vendedor. Si no tiene permiso, el backend responde 403.
export async function obtenerPedido(numero) {
  return adaptarPedido(await pedir(apiCatalogo.get(`/pedidos/${numero}`), "No encontramos la solicitud."));
}

// Cliente y contratista reciben solo los suyos; admin y vendedor, todos (más recientes primero)
export async function listarPedidos() {
  const datos = await pedir(apiCatalogo.get("/pedidos"), "No pudimos cargar los pedidos.");
  return datos.map(adaptarPedido);
}

export async function cambiarEstadoPedido(numero, estado) {
  return adaptarPedido(
    await pedir(apiCatalogo.patch(`/pedidos/${numero}/estado`, { estado }), "No pudimos cambiar el estado.")
  );
}

export async function anularPedido(numero) {
  return adaptarPedido(await pedir(apiCatalogo.patch(`/pedidos/${numero}/anular`), "No pudimos anular la solicitud."));
}

export async function obtenerSaldo() {
  return pedir(apiCatalogo.get("/pedidos/saldo"), "No pudimos obtener tu saldo.");
}
