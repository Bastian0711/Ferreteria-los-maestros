import { render, screen } from "@testing-library/react";
import EtiquetaEstado from "./EtiquetaEstado";

describe("EtiquetaEstado", () => {
  it("muestra el texto del estado", () => {
    // Arrange + Act
    render(<EtiquetaEstado estado="En preparación" />);

    // Assert
    expect(screen.getByText("En preparación")).toBeInTheDocument();
  });

  it.each([
    ["Pendiente", "bg-secondary"],
    ["En preparación", "bg-info"],
    ["Listo para retiro o despacho", "bg-primary"],
    ["Entregado", "bg-success"],
  ])("usa un color propio para el estado %s", (estado, clase) => {
    // Arrange + Act
    render(<EtiquetaEstado estado={estado} />);

    // Assert
    expect(screen.getByText(estado)).toHaveClass(clase);
  });

  it("usa un color neutro para un estado desconocido", () => {
    // Arrange + Act
    render(<EtiquetaEstado estado="Otro" />);

    // Assert
    expect(screen.getByText("Otro")).toHaveClass("bg-secondary");
  });
});
