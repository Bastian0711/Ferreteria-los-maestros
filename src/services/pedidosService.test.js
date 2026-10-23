import {
  crearPedido,
  obtenerPedido,
  listarPedidos,
  listarPedidosDeUsuario,
  actualizarEstadoPedido,
} from "./pedidosService";
import { obtenerProducto } from "./productosService";
import { reiniciarBase } from "../data/baseDatos";

// Usuarios de la semilla: id 2 = contratista con cuenta corriente, id 3 = cliente particular.
const CONTRATISTA = { id: 2 };
const PARTICULAR = { id: 3 };
const DATOS_CLIENTE = { nombre: "Camila", apellidos: "Soto Reyes", correo: "cliente@maestros.cl" };

function pedirRetiro(items, usuario) {
  return crearPedido({
    usuario,
    items,
    entrega: { tipo: "retiro" },
    datosCliente: DATOS_CLIENTE,
  });
}

describe("pedidosService", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  describe("crearPedido", () => {
    it("crea el pedido con número, estado pendiente y total", () => {
      // Arrange
      const items = [{ codigo: "MC002", cantidad: 2 }];

      // Act
      const pedido = pedirRetiro(items, PARTICULAR);

      // Assert
      expect(pedido.numero).toBe("FM-00001");
      expect(pedido.estado).toBe("Pendiente");
      expect(pedido.total).toBe(7490 * 2);
    });

    it("descuenta el stock de los productos pedidos", () => {
      // Arrange
      const stockAntes = obtenerProducto("MC002").stock;

      // Act
      pedirRetiro([{ codigo: "MC002", cantidad: 2 }], PARTICULAR);

      // Assert
      expect(obtenerProducto("MC002").stock).toBe(stockAntes - 2);
    });

    it("cobra el precio de oferta cuando el producto está en oferta", () => {
      // Arrange
      const precioOferta = obtenerProducto("MC001").precioOferta;

      // Act
      const pedido = pedirRetiro([{ codigo: "MC001", cantidad: 1 }], PARTICULAR);

      // Assert
      expect(pedido.items[0].precioUnitario).toBe(precioOferta);
    });

    it("junta en una sola línea el mismo producto repetido", () => {
      // Arrange
      const items = [
        { codigo: "MC002", cantidad: 1 },
        { codigo: "MC002", cantidad: 2 },
      ];

      // Act
      const pedido = pedirRetiro(items, PARTICULAR);

      // Assert
      expect(pedido.items).toHaveLength(1);
      expect(pedido.items[0].cantidad).toBe(3);
    });

    it("asigna números consecutivos a cada pedido", () => {
      // Arrange
      const items = [{ codigo: "MC002", cantidad: 1 }];

      // Act
      const primero = pedirRetiro(items, PARTICULAR);
      const segundo = pedirRetiro(items, PARTICULAR);

      // Assert
      expect(primero.numero).toBe("FM-00001");
      expect(segundo.numero).toBe("FM-00002");
    });

    it("deja el pago pendiente a fin de mes si el cliente tiene cuenta corriente", () => {
      // Arrange
      const items = [{ codigo: "MC002", cantidad: 1 }];

      // Act
      const pedido = pedirRetiro(items, CONTRATISTA);

      // Assert
      expect(pedido.pago).toBe("Pago pendiente a fin de mes");
      expect(pedido.usuarioId).toBe(2);
    });

    it("indica pago al retirar si el cliente no tiene cuenta corriente", () => {
      // Arrange
      const items = [{ codigo: "MC002", cantidad: 1 }];

      // Act
      const pedido = pedirRetiro(items, PARTICULAR);

      // Assert
      expect(pedido.pago).toBe("Pago al retirar o recibir");
    });
  });

  describe("errores al crear un pedido", () => {
    it("lanza un error si la cantidad supera el stock", () => {
      // Arrange
      const items = [{ codigo: "MC002", cantidad: 999 }];

      // Act
      const pedir = () => pedirRetiro(items, PARTICULAR);

      // Assert
      expect(pedir).toThrow("Stock insuficiente");
    });

    it("no descuenta nada ni crea el pedido si algún producto falla", () => {
      // Arrange
      const stockAntes = obtenerProducto("MC002").stock;
      const items = [
        { codigo: "MC002", cantidad: 1 },
        { codigo: "JA005", cantidad: 1 }, // JA005 está agotado en la semilla
      ];

      // Act
      const pedir = () => pedirRetiro(items, PARTICULAR);

      // Assert
      expect(pedir).toThrow("Stock insuficiente");
      expect(obtenerProducto("MC002").stock).toBe(stockAntes);
      expect(listarPedidos()).toHaveLength(0);
    });

    it("exige dirección cuando la entrega es por despacho", () => {
      // Arrange
      const datos = {
        usuario: PARTICULAR,
        items: [{ codigo: "MC002", cantidad: 1 }],
        entrega: { tipo: "despacho", direccion: "  " },
        datosCliente: DATOS_CLIENTE,
      };

      // Act
      const pedir = () => crearPedido(datos);

      // Assert
      expect(pedir).toThrow("Debes indicar la dirección de despacho.");
    });

    it("rechaza una solicitud sin productos", () => {
      // Arrange
      const items = [];

      // Act
      const pedir = () => pedirRetiro(items, PARTICULAR);

      // Assert
      expect(pedir).toThrow("La solicitud no tiene productos.");
    });

    it("rechaza un producto que ya no existe", () => {
      // Arrange
      const items = [{ codigo: "NO-EXISTE", cantidad: 1 }];

      // Act
      const pedir = () => pedirRetiro(items, PARTICULAR);

      // Assert
      expect(pedir).toThrow("ya no está disponible");
    });
  });

  describe("consultas", () => {
    it("obtiene un pedido por su número", () => {
      // Arrange
      const creado = pedirRetiro([{ codigo: "MC002", cantidad: 1 }], PARTICULAR);

      // Act
      const encontrado = obtenerPedido(creado.numero);

      // Assert
      expect(encontrado.total).toBe(creado.total);
    });

    it("devuelve undefined si el número de pedido no existe", () => {
      // Arrange
      const numero = "FM-99999";

      // Act
      const pedido = obtenerPedido(numero);

      // Assert
      expect(pedido).toBeUndefined();
    });

    it("lista solo los pedidos del usuario indicado", () => {
      // Arrange
      const items = [{ codigo: "MC002", cantidad: 1 }];
      const delContratista = pedirRetiro(items, CONTRATISTA);
      pedirRetiro(items, PARTICULAR);

      // Act
      const pedidos = listarPedidosDeUsuario(CONTRATISTA.id);

      // Assert
      expect(pedidos).toHaveLength(1);
      expect(pedidos[0].numero).toBe(delContratista.numero);
    });
  });

  describe("actualizarEstadoPedido", () => {
    it("cambia el estado del pedido", () => {
      // Arrange
      const creado = pedirRetiro([{ codigo: "MC002", cantidad: 1 }], PARTICULAR);

      // Act
      const actualizado = actualizarEstadoPedido(creado.numero, "En preparación");

      // Assert
      expect(actualizado.estado).toBe("En preparación");
    });

    it("rechaza un estado que no existe", () => {
      // Arrange
      const creado = pedirRetiro([{ codigo: "MC002", cantidad: 1 }], PARTICULAR);

      // Act
      const actualizar = () => actualizarEstadoPedido(creado.numero, "Estado raro");

      // Assert
      expect(actualizar).toThrow("Estado de pedido inválido.");
    });

    it("lanza un error si el pedido no existe", () => {
      // Arrange
      const numero = "FM-99999";

      // Act
      const actualizar = () => actualizarEstadoPedido(numero, "Entregado");

      // Assert
      expect(actualizar).toThrow("No existe el pedido FM-99999.");
    });
  });
});
