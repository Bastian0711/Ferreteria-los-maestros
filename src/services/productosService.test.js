import { vi } from "vitest";
import { apiCatalogo } from "./api";

// setupTests.js reemplaza este servicio por uno simulado; aquí se prueba el real
const servicio = await vi.importActual("./productosService");

vi.mock("./api", async (importOriginal) => {
  const original = await importOriginal();
  return { ...original, apiCatalogo: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() } };
});

const PRODUCTO_API = {
  codigo: "MC002", nombre: "Cemento Melón blanco 25 kg", marca: "Melón", unidad: "Saco 25 kg",
  precioVenta: 7490, precioOferta: null, oferta: false, precioFinal: 7490,
  stock: 40, stockMinimo: 10, stockCritico: false, destacado: false, categoriaId: 1, categoria: "Materiales de Construcción",
};

describe("productosService (API real)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adapta el producto de la API: categoría como texto e imagen local", () => {
    // Arrange + Act
    const producto = servicio.adaptarProducto(PRODUCTO_API);

    // Assert
    expect(producto.categoriaId).toBe("1");
    expect(producto.imagen).toBe("/productos/MC002.jpg");
    expect(producto.oferta).toBe(false);
  });

  it("lista los productos desde GET /productos y los guarda en caché", async () => {
    // Arrange
    apiCatalogo.get.mockResolvedValue({ data: [PRODUCTO_API] });

    // Act
    const productos = await servicio.listarProductos();

    // Assert
    expect(apiCatalogo.get).toHaveBeenCalledWith("/productos");
    expect(productos).toHaveLength(1);
    expect(servicio.catalogoEnCache().productos[0].codigo).toBe("MC002");
  });

  it("lista las categorías con el id como texto", async () => {
    // Arrange
    apiCatalogo.get.mockResolvedValue({ data: [{ id: 3, nombre: "Herramientas Manuales" }] });

    // Act
    const categorias = await servicio.listarCategorias();

    // Assert
    expect(categorias).toEqual([{ id: "3", nombre: "Herramientas Manuales" }]);
  });

  it("convierte los datos del formulario al cuerpo que espera la API", () => {
    // Arrange
    const datos = {
      codigo: "MC099", nombre: "Prueba", marca: "X", unidad: "Unidad", precioVenta: "1000",
      stock: "5", stockMinimo: "1", oferta: false, precioOferta: 800, destacado: true, categoriaId: "1",
    };

    // Act
    const cuerpo = servicio.aProductoApi(datos);

    // Assert
    expect(cuerpo).toEqual({
      codigo: "MC099", nombre: "Prueba", marca: "X", unidad: "Unidad", precioVenta: 1000,
      precioOferta: null, stock: 5, stockMinimo: 1, destacado: true, categoriaId: 1,
    });
  });

  it("crea un producto con POST /productos", async () => {
    // Arrange
    apiCatalogo.post.mockResolvedValue({ data: PRODUCTO_API });

    // Act
    const creado = await servicio.crearProducto({ ...PRODUCTO_API, categoriaId: "1" });

    // Assert
    expect(apiCatalogo.post).toHaveBeenCalledWith("/productos", expect.objectContaining({ codigo: "MC002", categoriaId: 1 }));
    expect(creado.codigo).toBe("MC002");
  });

  it("modifica un producto con PUT /productos/{codigo}", async () => {
    // Arrange
    apiCatalogo.put.mockResolvedValue({ data: { ...PRODUCTO_API, stock: 3 } });

    // Act
    const actualizado = await servicio.actualizarProducto("MC002", { ...PRODUCTO_API, stock: 3, categoriaId: "1" });

    // Assert
    expect(apiCatalogo.put).toHaveBeenCalledWith("/productos/MC002", expect.objectContaining({ stock: 3 }));
    expect(actualizado.stock).toBe(3);
  });

  it("muestra el mensaje del backend si no se puede eliminar (409)", async () => {
    // Arrange
    apiCatalogo.delete.mockRejectedValue({
      response: { status: 409, data: { mensaje: "El producto tiene pedidos asociados y no se puede eliminar.", detalles: [] } },
    });

    // Act + Assert
    await expect(servicio.eliminarProducto("MC002")).rejects.toThrow("El producto tiene pedidos asociados");
  });

  it("calcula el precio final con la oferta", () => {
    // Arrange + Act + Assert
    expect(servicio.precioFinal({ oferta: true, precioOferta: 900, precioVenta: 1000 })).toBe(900);
  });
});
