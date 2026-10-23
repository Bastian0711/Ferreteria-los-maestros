import { render, screen } from "@testing-library/react";
import UltimosPedidos from "./UltimosPedidos";

const pedido = {
  numero: "FM-00001",
  fecha: "2026-10-20T12:00:00.000Z",
  total: 14980,
  estado: "Pendiente",
  pago: "Pago pendiente a fin de mes",
};

describe("UltimosPedidos", () => {
  it("muestra número, estado y forma de pago de cada pedido", () => {
    // Arrange + Act
    render(<UltimosPedidos pedidos={[pedido]} />);

    // Assert
    expect(screen.getByText("FM-00001")).toBeInTheDocument();
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
    expect(screen.getByText("Pago pendiente a fin de mes")).toBeInTheDocument();
  });

  it("avisa cuando aún no hay pedidos", () => {
    // Arrange + Act
    render(<UltimosPedidos pedidos={[]} />);

    // Assert
    expect(screen.getByText("Aún no hay pedidos.")).toBeInTheDocument();
  });
});
