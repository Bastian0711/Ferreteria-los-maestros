import { render, screen } from "@testing-library/react";
import PanelStockCritico from "./PanelStockCritico";

describe("PanelStockCritico", () => {
  it("lista los productos recibidos", () => {
    // Arrange
    const productos = [
      { codigo: "A1", nombre: "Taladro", stock: 1, stockMinimo: 3 },
      { codigo: "A2", nombre: "Pala", stock: 0, stockMinimo: 5 },
    ];

    // Act
    render(<PanelStockCritico productos={productos} />);

    // Assert
    expect(screen.getByText("Taladro")).toBeInTheDocument();
    expect(screen.getByText("Pala")).toBeInTheDocument();
    expect(screen.getByText("Sin stock")).toBeInTheDocument();
  });

  it("avisa cuando no hay productos críticos", () => {
    // Arrange + Act
    render(<PanelStockCritico productos={[]} />);

    // Assert
    expect(screen.getByText("No hay productos con stock crítico.")).toBeInTheDocument();
  });
});
