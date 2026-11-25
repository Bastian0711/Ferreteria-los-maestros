import { vi } from "vitest";
import { apiCatalogo } from "./api";

// setupTests.js reemplaza este servicio por uno simulado; aquí se prueba el real
const servicio = await vi.importActual("./pedidosService");

vi.mock("./api", async (importOriginal) => {
  const original = await importOriginal();
  return { ...original, apiCatalogo: { get: vi.fn(), post: vi.fn(), patch: vi.fn() } };
});

const PEDIDO_API = {
  id: 1, numero: "FM-00001", fecha: "2026-11-25T04:01:32Z", estado: "Pendiente", tipoEntrega: "despacho",
  direccionDespacho: "Av. del Mar 123", condicionPago: "Pago al retirar o recibir", total: 2000, idUsuario: 4,
  items: [{ codigo: "MC099", nombre: "Producto de prueba", cantidad: 2, precioUnitario: 1000, subtotal: 2000 }],
};

describe("pedidosService (API real)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adapta el pedido de la API a la forma de las pantallas", () => {
    // Arrange + Act
    const pedido = servicio.adaptarPedido(PEDIDO_API);

    // Assert
    expect(pedido.entrega).toEqual({ tipo: "despacho", direccion: "Av. del Mar 123" });
    expect(pedido.pago).toBe("Pago al retirar o recibir");
    expect(pedido.usuarioId).toBe(4);
  });

  it("envía solo productos, cantidades y entrega: el resto lo calcula el backend", async () => {
    // Arrange
    apiCatalogo.post.mockResolvedValue({ data: PEDIDO_API });

    // Act
    await servicio.crearPedido({
      items: [{ codigo: "MC099", cantidad: 2, precioUnitario: 1 }],
      entrega: { tipo: "retiro", direccion: "" },
    });

    // Assert
    expect(apiCatalogo.post).toHaveBeenCalledWith("/pedidos", {
      items: [{ codigo: "MC099", cantidad: 2 }],
      tipoEntrega: "retiro",
      direccionDespacho: null,
    });
  });

  it("muestra el detalle del 409 cuando no hay stock suficiente", async () => {
    // Arrange
    apiCatalogo.post.mockRejectedValue({
      response: {
        status: 409,
        data: { mensaje: "No hay stock suficiente para completar el pedido.", detalles: ["MC099 Producto de prueba: pediste 50, hay 5"] },
      },
    });

    // Act + Assert
    await expect(
      servicio.crearPedido({ items: [{ codigo: "MC099", cantidad: 50 }], entrega: { tipo: "retiro" } })
    ).rejects.toMatchObject({ status: 409, message: expect.stringContaining("pediste 50, hay 5") });
  });

  it("pide un pedido por su número", async () => {
    // Arrange
    apiCatalogo.get.mockResolvedValue({ data: PEDIDO_API });

    // Act
    const pedido = await servicio.obtenerPedido("FM-00001");

    // Assert
    expect(apiCatalogo.get).toHaveBeenCalledWith("/pedidos/FM-00001");
    expect(pedido.numero).toBe("FM-00001");
  });

  it("avanza el estado con PATCH /pedidos/{numero}/estado", async () => {
    // Arrange
    apiCatalogo.patch.mockResolvedValue({ data: { ...PEDIDO_API, estado: "En preparación" } });

    // Act
    const pedido = await servicio.cambiarEstadoPedido("FM-00001", "En preparación");

    // Assert
    expect(apiCatalogo.patch).toHaveBeenCalledWith("/pedidos/FM-00001/estado", { estado: "En preparación" });
    expect(pedido.estado).toBe("En preparación");
  });

  it("calcula el siguiente estado y no avanza desde Entregado", () => {
    // Arrange + Act + Assert
    expect(servicio.siguienteEstado("Pendiente")).toBe("En preparación");
    expect(servicio.siguienteEstado("Entregado")).toBeNull();
    expect(servicio.siguienteEstado("Anulado")).toBeNull();
  });
});
