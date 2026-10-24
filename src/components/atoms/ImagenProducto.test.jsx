import { render, screen, fireEvent } from "@testing-library/react";
import ImagenProducto from "./ImagenProducto";

describe("ImagenProducto", () => {
  it("muestra la foto cuando hay una ruta", () => {
    // Arrange + Act
    render(<ImagenProducto src="/productos/MC001.jpg" alt="Cemento" />);

    // Assert
    expect(screen.getByAltText("Cemento")).toHaveAttribute("src", "/productos/MC001.jpg");
  });

  it("muestra 'Sin imagen' cuando no hay ruta", () => {
    // Arrange + Act
    render(<ImagenProducto src="" alt="Cemento" />);

    // Assert
    expect(screen.getByText("Sin imagen")).toBeInTheDocument();
    expect(screen.queryByAltText("Cemento")).not.toBeInTheDocument();
  });

  it("cambia a 'Sin imagen' si el archivo no carga", () => {
    // Arrange
    render(<ImagenProducto src="/productos/NOEXISTE.jpg" alt="Cemento" />);

    // Act
    fireEvent.error(screen.getByAltText("Cemento"));

    // Assert
    expect(screen.getByText("Sin imagen")).toBeInTheDocument();
  });

  it("aplica la altura fija cuando se indica", () => {
    // Arrange + Act
    render(<ImagenProducto src="/productos/MC001.jpg" alt="Cemento" alto={160} />);

    // Assert
    expect(screen.getByAltText("Cemento")).toHaveStyle({ height: "160px" });
  });
});
