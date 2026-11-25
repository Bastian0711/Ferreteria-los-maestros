import { apiCatalogo, mensajeDeError } from "./api";
import { precioFinal as calcularPrecioFinal } from "../utils/precios";

// Convierte un producto de ms-catalogo a la forma que usan las pantallas.
// categoriaId se deja como texto para compararlo con los parámetros de la URL.
export function adaptarProducto(p) {
  return {
    codigo: p.codigo,
    nombre: p.nombre,
    marca: p.marca,
    unidad: p.unidad,
    categoriaId: String(p.categoriaId),
    categoria: p.categoria,
    precioVenta: p.precioVenta,
    precioOferta: p.precioOferta,
    oferta: Boolean(p.oferta),
    destacado: Boolean(p.destacado),
    stock: p.stock,
    stockMinimo: p.stockMinimo,
    imagen: `/productos/${p.codigo}.jpg`,
  };
}

export function adaptarCategoria(c) {
  return { id: String(c.id), nombre: c.nombre };
}

// Datos del formulario de administración → cuerpo que espera la API
export function aProductoApi(datos) {
  return {
    codigo: datos.codigo,
    nombre: datos.nombre,
    marca: datos.marca,
    unidad: datos.unidad,
    precioVenta: Number(datos.precioVenta),
    precioOferta: datos.oferta && datos.precioOferta ? Number(datos.precioOferta) : null,
    stock: Number(datos.stock),
    stockMinimo: Number(datos.stockMinimo),
    destacado: Boolean(datos.destacado),
    categoriaId: Number(datos.categoriaId),
  };
}

// Ejecuta una petición y convierte cualquier error en un Error con mensaje legible
async function pedir(promesa, porDefecto) {
  try {
    const { data } = await promesa;
    return data;
  } catch (error) {
    throw new Error(mensajeDeError(error, porDefecto));
  }
}

// Última versión recibida del catálogo: al volver a montar la app se muestra al tiro,
// mientras llega la versión nueva desde la API.
const cache = { productos: [], categorias: [] };

export function catalogoEnCache() {
  return cache;
}

export async function listarProductos() {
  const datos = await pedir(apiCatalogo.get("/productos"), "No pudimos cargar el catálogo.");
  cache.productos = datos.map(adaptarProducto);
  return cache.productos;
}

export async function listarCategorias() {
  const datos = await pedir(apiCatalogo.get("/categorias"), "No pudimos cargar las categorías.");
  cache.categorias = datos.map(adaptarCategoria);
  return cache.categorias;
}

export async function obtenerProducto(codigo) {
  return adaptarProducto(await pedir(apiCatalogo.get(`/productos/${codigo}`), "Producto no encontrado."));
}

export async function crearProducto(datos) {
  return adaptarProducto(await pedir(apiCatalogo.post("/productos", aProductoApi(datos)), "No pudimos crear el producto."));
}

export async function actualizarProducto(codigo, datos) {
  return adaptarProducto(
    await pedir(apiCatalogo.put(`/productos/${codigo}`, aProductoApi({ ...datos, codigo })), "No pudimos guardar el producto.")
  );
}

export async function eliminarProducto(codigo) {
  await pedir(apiCatalogo.delete(`/productos/${codigo}`), "No pudimos eliminar el producto.");
}

export function precioFinal(producto) {
  return calcularPrecioFinal(producto);
}
