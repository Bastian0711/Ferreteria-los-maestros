import { render, screen } from "@testing-library/react";
import PieDePagina from "./PieDePagina";

describe("PieDePagina", () => {
  it("muestra el año recibido y la ubicación", () => {
    // Arrange + Act
    render(<PieDePagina anio={2030} />);

    // Assert
    expect(screen.getByText("© 2030 Ferretería Los Maestros")).toBeInTheDocument();
    expect(screen.getByText(/La Serena/)).toBeInTheDocument();
  });

  it("usa el año actual si no se entrega ninguno", () => {
    // Arrange
    const anioActual = new Date().getFullYear();

    // Act
    render(<PieDePagina />);

    // Assert
    expect(screen.getByText(`© ${anioActual} Ferretería Los Maestros`)).toBeInTheDocument();
  });
});
