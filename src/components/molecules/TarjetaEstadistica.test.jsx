import { render, screen } from "@testing-library/react";
import TarjetaEstadistica from "./TarjetaEstadistica";

describe("TarjetaEstadistica", () => {
  it("muestra el título y el valor", () => {
    // Arrange + Act
    render(<TarjetaEstadistica titulo="Total de productos" valor={85} />);

    // Assert
    expect(screen.getByText("Total de productos")).toBeInTheDocument();
    expect(screen.getByText("85")).toBeInTheDocument();
  });

  it("muestra el detalle solo si se entrega", () => {
    // Arrange + Act
    const { rerender } = render(<TarjetaEstadistica titulo="Stock" valor={2} />);
    const sinDetalle = screen.queryByText("Bajo el mínimo");
    rerender(<TarjetaEstadistica titulo="Stock" valor={2} detalle="Bajo el mínimo" />);

    // Assert
    expect(sinDetalle).not.toBeInTheDocument();
    expect(screen.getByText("Bajo el mínimo")).toBeInTheDocument();
  });

  it("aplica el color de la variante", () => {
    // Arrange + Act
    const { container } = render(<TarjetaEstadistica titulo="X" valor={1} variante="danger" />);

    // Assert
    expect(container.firstChild).toHaveClass("border-danger");
  });
});
