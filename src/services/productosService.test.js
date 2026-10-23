import { vi } from "vitest";
import {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  listarProductosCriticos,
  listarProductosEnOferta,
  listarProductosDestacados,
  listarCategorias,
  precioFinal,
  suscribirCambios,
} from "./productosService";
import { reiniciarBase } from "../data/baseDatos";

const PRODUCTO_NUEVO = {
  codigo: "ZZ001",
  nombre: "Producto de prueba",
  precioVenta: 1000,
  stock: 5,
  stockMinimo: 2,
};

describe("productosService", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("lectura", () => {
    it("lista los 85 productos de la semilla", () => {
      // Arrange + Act
      const productos = listarProductos();

      // Assert
      expect(productos).toHaveLength(85);
    });

    it("lista las 10 categorías", () => {
      // Arrange + Act
      const categorias = listarCategorias();

      // Assert
      expect(categorias).toHaveLength(10);
    });

    it("obtiene un producto por su código", () => {
      // Arrange
      const codigo = "MC001";

      // Act
      const producto = obtenerProducto(codigo);

      // Assert
      expect(producto.nombre).toBe("Cemento Polpaico gris 25 kg");
    });

    it("devuelve undefined si el código no existe", () => {
      // Arrange
      const codigo = "NO-EXISTE";

      // Act
      const producto = obtenerProducto(codigo);

      // Assert
      expect(producto).toBeUndefined();
    });
  });

  describe("creación", () => {
    it("crea un producto y aumenta el total en uno", () => {
      // Arrange
      const totalAntes = listarProductos().length;

      // Act
      crearProducto(PRODUCTO_NUEVO);

      // Assert
      expect(listarProductos()).toHaveLength(totalAntes + 1);
      expect(obtenerProducto("ZZ001").nombre).toBe("Producto de prueba");
    });

    it("guarda el código en mayúsculas", () => {
      // Arrange
      const datos = { ...PRODUCTO_NUEVO, codigo: "zz001" };

      // Act
      const creado = crearProducto(datos);

      // Assert
      expect(creado.codigo).toBe("ZZ001");
    });

    it("rechaza un código que ya existe", () => {
      // Arrange
      const datos = { ...PRODUCTO_NUEVO, codigo: "MC001" };

      // Act
      const crear = () => crearProducto(datos);

      // Assert
      expect(crear).toThrow("Ya existe un producto con el código MC001.");
    });

    it("rechaza un producto sin nombre", () => {
      // Arrange
      const datos = { ...PRODUCTO_NUEVO, nombre: "  " };

      // Act
      const crear = () => crearProducto(datos);

      // Assert
      expect(crear).toThrow("El nombre es obligatorio.");
    });

    it("rechaza un precio de venta negativo", () => {
      // Arrange
      const datos = { ...PRODUCTO_NUEVO, precioVenta: -5 };

      // Act
      const crear = () => crearProducto(datos);

      // Assert
      expect(crear).toThrow("El precio de venta debe ser un número mayor o igual a 0.");
    });
  });

  describe("actualización", () => {
    it("modifica solo los campos enviados", () => {
      // Arrange
      const nombreAntes = obtenerProducto("MC001").nombre;

      // Act
      actualizarProducto("MC001", { stock: 10 });

      // Assert
      const producto = obtenerProducto("MC001");
      expect(producto.stock).toBe(10);
      expect(producto.nombre).toBe(nombreAntes);
    });

    it("no permite cambiar el código del producto", () => {
      // Arrange
      const cambios = { codigo: "XX999", stock: 1 };

      // Act
      actualizarProducto("MC001", cambios);

      // Assert
      expect(obtenerProducto("MC001")).toBeDefined();
      expect(obtenerProducto("XX999")).toBeUndefined();
    });

    it("quita el precio de oferta cuando se desactiva la oferta", () => {
      // Arrange
      const cambios = { oferta: false };

      // Act
      const producto = actualizarProducto("MC001", cambios);

      // Assert
      expect(producto.precioOferta).toBeNull();
    });

    it("lanza un error si el producto no existe", () => {
      // Arrange
      const codigo = "NO-EXISTE";

      // Act
      const actualizar = () => actualizarProducto(codigo, { stock: 1 });

      // Assert
      expect(actualizar).toThrow("No existe el producto NO-EXISTE.");
    });
  });

  describe("eliminación", () => {
    it("elimina un producto existente", () => {
      // Arrange
      const totalAntes = listarProductos().length;

      // Act
      const resultado = eliminarProducto("MC001");

      // Assert
      expect(resultado).toBe(true);
      expect(obtenerProducto("MC001")).toBeUndefined();
      expect(listarProductos()).toHaveLength(totalAntes - 1);
    });

    it("devuelve false si el producto no existe", () => {
      // Arrange
      const codigo = "NO-EXISTE";

      // Act
      const resultado = eliminarProducto(codigo);

      // Assert
      expect(resultado).toBe(false);
    });
  });

  describe("consultas especiales", () => {
    it("los productos críticos tienen stock igual o menor al mínimo", () => {
      // Arrange + Act
      const criticos = listarProductosCriticos();

      // Assert
      expect(criticos.length).toBeGreaterThan(0);
      expect(criticos.every((p) => p.stock <= p.stockMinimo)).toBe(true);
    });

    it("lista solo los productos en oferta", () => {
      // Arrange + Act
      const ofertas = listarProductosEnOferta();

      // Assert
      expect(ofertas.length).toBeGreaterThan(0);
      expect(ofertas.every((p) => p.oferta)).toBe(true);
    });

    it("lista solo los productos destacados", () => {
      // Arrange + Act
      const destacados = listarProductosDestacados();

      // Assert
      expect(destacados.length).toBeGreaterThan(0);
      expect(destacados.every((p) => p.destacado)).toBe(true);
    });

    it("el precio final es el de oferta cuando el producto está en oferta", () => {
      // Arrange
      const enOferta = obtenerProducto("MC001");

      // Act
      const precio = precioFinal(enOferta);

      // Assert
      expect(precio).toBe(enOferta.precioOferta);
    });

    it("el precio final es el de venta cuando no hay oferta", () => {
      // Arrange
      const normal = obtenerProducto("MC002");

      // Act
      const precio = precioFinal(normal);

      // Assert
      expect(precio).toBe(7490);
    });
  });

  describe("persistencia y suscripción", () => {
    it("guarda en localStorage cada vez que cambian los datos", () => {
      // Arrange
      const espia = vi.spyOn(Storage.prototype, "setItem");

      // Act
      crearProducto(PRODUCTO_NUEVO);

      // Assert
      expect(espia).toHaveBeenCalledWith("ferreteria_db", expect.any(String));
    });

    it("el producto creado queda guardado en localStorage", () => {
      // Arrange
      crearProducto(PRODUCTO_NUEVO);

      // Act
      const guardado = JSON.parse(localStorage.getItem("ferreteria_db"));

      // Assert
      expect(guardado.productos.some((p) => p.codigo === "ZZ001")).toBe(true);
    });

    it("avisa a los suscriptores cuando cambian los datos", () => {
      // Arrange
      const callback = vi.fn();
      suscribirCambios(callback);

      // Act
      actualizarProducto("MC001", { stock: 1 });

      // Assert
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("deja de avisar cuando se cancela la suscripción", () => {
      // Arrange
      const callback = vi.fn();
      const cancelar = suscribirCambios(callback);
      cancelar();

      // Act
      actualizarProducto("MC001", { stock: 1 });

      // Assert
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
