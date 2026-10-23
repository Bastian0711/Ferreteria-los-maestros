// Vive en memoria y se guarda en localStorage
// (clave `ferreteria_db`) tras cada cambio.

import { CATEGORIAS_SEMILLA, PRODUCTOS_SEMILLA } from "./productosSemilla.js";
import { precioFinal } from "../utils/precios.js";

const CLAVE_BD = "ferreteria_db";
const VERSION_BD = 1;

export const ESTADOS_PEDIDO = [
  "Pendiente",
  "En preparación",
  "Listo para retiro o despacho",
  "Entregado",
];

const USUARIOS_SEMILLA = [
  {
    id: 1,
    nombre: "Administrador",
    apellidos: "Los Maestros",
    correo: "admin@maestros.cl",
    contrasena: "Admin123!",
    rol: "admin",
    direccion: "Av. Francisco de Aguirre 100, La Serena",
    cuentaCorriente: false,
    activo: true,
  },
  {
    id: 2,
    nombre: "Carlos",
    apellidos: "Maturana Díaz",
    correo: "contratista@maestros.cl",
    contrasena: "Contratista123!",
    rol: "cliente",
    direccion: "Los Carrera 450, La Serena",
    cuentaCorriente: true,
    activo: true,
  },
  {
    id: 3,
    nombre: "Camila",
    apellidos: "Soto Reyes",
    correo: "cliente@maestros.cl",
    contrasena: "Cliente123!",
    rol: "cliente",
    direccion: "Pasaje Los Olivos 12, Coquimbo",
    cuentaCorriente: false,
    activo: true,
  },
];

// ---------- Estado y persistencia ----------

function copiar(valor) {
  return JSON.parse(JSON.stringify(valor));
}

function estadoInicial() {
  return {
    version: VERSION_BD,
    productos: copiar(PRODUCTOS_SEMILLA),
    categorias: copiar(CATEGORIAS_SEMILLA),
    usuarios: copiar(USUARIOS_SEMILLA),
    pedidos: [],
    ultimoPedido: 0,
  };
}

function cargar() {
  try {
    const texto = localStorage.getItem(CLAVE_BD);
    if (texto) {
      const guardado = JSON.parse(texto);
      if (guardado && guardado.version === VERSION_BD) return guardado;
    }
  } catch {
  }
  return estadoInicial();
}

let estado = cargar();
const suscriptores = new Set();

function guardar() {
  try {
    localStorage.setItem(CLAVE_BD, JSON.stringify(estado));
  } catch {
  }
  suscriptores.forEach((callback) => callback());
}

export function suscribir(callback) {
  suscriptores.add(callback);
  return () => suscriptores.delete(callback);
}

// Vuelve a los datos de la semilla (útil para tests y para "restablecer demo").
export function reiniciarBase() {
  estado = estadoInicial();
  guardar();
}

// ---------- Productos (CRUD) ----------

export { precioFinal };

export function listarProductos() {
  return copiar(estado.productos);
}

export function obtenerProducto(codigo) {
  const producto = estado.productos.find((p) => p.codigo === codigo);
  return producto ? copiar(producto) : undefined;
}

function validarNumero(valor, campo) {
  const numero = Number(valor);
  if (!Number.isFinite(numero) || numero < 0) {
    throw new Error(`${campo} debe ser un número mayor o igual a 0.`);
  }
  return numero;
}

export function crearProducto(datos) {
  const codigo = String(datos.codigo || "").trim().toUpperCase();
  const nombre = String(datos.nombre || "").trim();

  if (!codigo) throw new Error("El código es obligatorio.");
  if (!nombre) throw new Error("El nombre es obligatorio.");
  if (estado.productos.some((p) => p.codigo === codigo)) {
    throw new Error(`Ya existe un producto con el código ${codigo}.`);
  }

  const producto = {
    codigo,
    nombre,
    marca: datos.marca || "",
    unidad: datos.unidad || "Unidad",
    categoriaId: datos.categoriaId || "",
    subcategoria: datos.subcategoria || "",
    precioCompra: validarNumero(datos.precioCompra ?? 0, "El precio de compra"),
    precioVenta: validarNumero(datos.precioVenta, "El precio de venta"),
    stock: validarNumero(datos.stock ?? 0, "El stock"),
    stockMinimo: validarNumero(datos.stockMinimo ?? 0, "El stock mínimo"),
    oferta: Boolean(datos.oferta),
    precioOferta: datos.oferta ? validarNumero(datos.precioOferta, "El precio de oferta") : null,
    destacado: Boolean(datos.destacado),
    imagen: datos.imagen || "",
  };

  estado.productos.push(producto);
  guardar();
  return copiar(producto);
}

export function actualizarProducto(codigo, cambios) {
  const producto = estado.productos.find((p) => p.codigo === codigo);
  if (!producto) throw new Error(`No existe el producto ${codigo}.`);

  const resto = { ...cambios };
  delete resto.codigo; // el código es la clave del producto y no se modifica
  for (const campo of ["precioCompra", "precioVenta", "stock", "stockMinimo"]) {
    if (campo in resto) resto[campo] = validarNumero(resto[campo], campo);
  }
  Object.assign(producto, resto);
  if (!producto.oferta) producto.precioOferta = null;

  guardar();
  return copiar(producto);
}

export function eliminarProducto(codigo) {
  const antes = estado.productos.length;
  estado.productos = estado.productos.filter((p) => p.codigo !== codigo);
  const eliminado = estado.productos.length < antes;
  if (eliminado) guardar();
  return eliminado;
}

export function listarProductosCriticos() {
  return listarProductos().filter((p) => p.stock <= p.stockMinimo);
}

// ---------- Categorías ----------

export function listarCategorias() {
  return copiar(estado.categorias);
}

// ---------- Usuarios ----------

function sinContrasena(usuario) {
  const publico = copiar(usuario);
  delete publico.contrasena;
  return publico;
}

export function listarUsuarios() {
  return estado.usuarios.map(sinContrasena);
}

export function obtenerUsuario(id) {
  const usuario = estado.usuarios.find((u) => u.id === id);
  return usuario ? sinContrasena(usuario) : undefined;
}

export function buscarUsuarioPorCorreo(correo) {
  const buscado = String(correo || "").trim().toLowerCase();
  const usuario = estado.usuarios.find((u) => u.correo.toLowerCase() === buscado);
  return usuario ? copiar(usuario) : undefined;
}

export function crearUsuario(datos) {
  const correo = String(datos.correo || "").trim().toLowerCase();
  if (!correo) throw new Error("El correo es obligatorio.");
  if (estado.usuarios.some((u) => u.correo.toLowerCase() === correo)) {
    throw new Error("Ya existe una cuenta con ese correo.");
  }

  const siguienteId = estado.usuarios.reduce((max, u) => Math.max(max, u.id), 0) + 1;
  const usuario = {
    id: siguienteId,
    nombre: datos.nombre || "",
    apellidos: datos.apellidos || "",
    correo,
    contrasena: datos.contrasena,
    rol: datos.rol || "cliente",
    direccion: datos.direccion || "",
    cuentaCorriente: Boolean(datos.cuentaCorriente),
    activo: true,
  };

  estado.usuarios.push(usuario);
  guardar();
  return sinContrasena(usuario);
}

// ---------- Pedidos ----------
export function crearPedido({ usuario, items, entrega, datosCliente }) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("La solicitud no tiene productos.");
  }
  if (!entrega || !["retiro", "despacho"].includes(entrega.tipo)) {
    throw new Error("Debes elegir retiro en tienda o despacho.");
  }
  if (entrega.tipo === "despacho" && !String(entrega.direccion || "").trim()) {
    throw new Error("Debes indicar la dirección de despacho.");
  }

  const cantidades = new Map();
  for (const item of items) {
    cantidades.set(item.codigo, (cantidades.get(item.codigo) || 0) + Number(item.cantidad));
  }

  const lineas = [];
  for (const [codigo, cantidad] of cantidades) {
    const producto = estado.productos.find((p) => p.codigo === codigo);
    if (!producto) throw new Error(`El producto ${codigo} ya no está disponible.`);
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new Error(`Cantidad inválida para "${producto.nombre}".`);
    }
    if (cantidad > producto.stock) {
      throw new Error(`Stock insuficiente de "${producto.nombre}": quedan ${producto.stock}.`);
    }
    const precioUnitario = precioFinal(producto);
    lineas.push({
      codigo,
      nombre: producto.nombre,
      cantidad,
      precioUnitario,
      subtotal: precioUnitario * cantidad,
    });
  }

  lineas.forEach((linea) => {
    const producto = estado.productos.find((p) => p.codigo === linea.codigo);
    producto.stock -= linea.cantidad;
  });

  const cliente = usuario ? estado.usuarios.find((u) => u.id === usuario.id) : null;
  estado.ultimoPedido += 1;

  const pedido = {
    numero: `FM-${String(estado.ultimoPedido).padStart(5, "0")}`,
    fecha: new Date().toISOString(),
    usuarioId: cliente ? cliente.id : null,
    cliente: { ...datosCliente },
    entrega: { tipo: entrega.tipo, direccion: entrega.direccion || "" },
    items: lineas,
    total: lineas.reduce((suma, linea) => suma + linea.subtotal, 0),
    estado: ESTADOS_PEDIDO[0],
    pago: cliente && cliente.cuentaCorriente
      ? "Pago pendiente a fin de mes"
      : "Pago al retirar o recibir",
  };

  estado.pedidos.push(pedido);
  guardar();
  return copiar(pedido);
}

export function listarPedidos() {
  return copiar(estado.pedidos);
}

export function obtenerPedido(numero) {
  const pedido = estado.pedidos.find((p) => p.numero === numero);
  return pedido ? copiar(pedido) : undefined;
}

export function listarPedidosDeUsuario(usuarioId) {
  return copiar(estado.pedidos.filter((p) => p.usuarioId === usuarioId));
}

export function actualizarEstadoPedido(numero, nuevoEstado) {
  const pedido = estado.pedidos.find((p) => p.numero === numero);
  if (!pedido) throw new Error(`No existe el pedido ${numero}.`);
  if (!ESTADOS_PEDIDO.includes(nuevoEstado)) throw new Error("Estado de pedido inválido.");
  pedido.estado = nuevoEstado;
  guardar();
  return copiar(pedido);
}
