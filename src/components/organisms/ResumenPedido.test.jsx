import { render, screen } from "@testing-library/react";
import ResumenPedido from "./ResumenPedido";

const PEDIDO = {
  numero: "FM-00001",
  fecha: "2026-10-23T15:00:00.000Z",
  cliente: { nombre: "Camila", apellidos: "Soto Reyes", correo: "camila@correo.cl" },
  entrega: { tipo: "retiro", direccion: "" },
  items: [
    {
      codigo: "MC002", nombre: "Cemento Melón blanco 25 kg",
      cantidad: 2, precioUnitario: 7490, subtotal: 14980,
    },
  ],
  total: 14980,
  estado: "Pendiente",
  pago: "Pago al retirar o recibir",
};

describe("ResumenPedido", () => {
  it("muestra el estado del pedido", () => {
    // Arrange + Act
    render(<ResumenPedido pedido={PEDIDO} />);

    // Assert
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
  });

  it("muestra los datos del cliente", () => {
    // Arrange + Act
    render(<ResumenPedido pedido={PEDIDO} />);

    // Assert
    expect(screen.getByText("Camila Soto Reyes · camila@correo.cl")).toBeInTheDocument();
  });

  it("muestra cada producto con su precio y subtotal", () => {
    // Arrange + Act
    render(<ResumenPedido pedido={PEDIDO} />);

    // Assert
    expect(screen.getByText("Cemento Melón blanco 25 kg")).toBeInTheDocument();
    expect(screen.getByText("$7.490")).toBeInTheDocument();
  });

  it("muestra el total del pedido", () => {
    // Arrange + Act
    render(<ResumenPedido pedido={PEDIDO} />);

    // Assert
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getAllByText("$14.980")).toHaveLength(2); // subtotal de la fila y total
  });

  it("indica retiro en tienda cuando corresponde", () => {
    // Arrange + Act
    render(<ResumenPedido pedido={PEDIDO} />);

    // Assert
    expect(screen.getByText("Retiro en tienda")).toBeInTheDocument();
  });

  it("muestra la dirección cuando es despacho", () => {
    // Arrange
    const despacho = { ...PEDIDO, entrega: { tipo: "despacho", direccion: "Av. Siempre Viva 123" } };

    // Act
    render(<ResumenPedido pedido={despacho} />);

    // Assert
    expect(screen.getByText("Despacho a domicilio: Av. Siempre Viva 123")).toBeInTheDocument();
  });

  it("muestra la forma de pago, incluida la cuenta corriente", () => {
    // Arrange
    const cuentaCorriente = { ...PEDIDO, pago: "Pago pendiente a fin de mes" };

    // Act
    render(<ResumenPedido pedido={cuentaCorriente} />);

    // Assert
    expect(screen.getByText("Pago pendiente a fin de mes")).toBeInTheDocument();
  });
});
