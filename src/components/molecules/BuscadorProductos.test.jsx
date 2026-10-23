import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import BuscadorProductos from "./BuscadorProductos";

describe("BuscadorProductos", () => {
  it("muestra la etiqueta y el texto de ayuda por defecto", () => {
    // Arrange + Act
    render(<BuscadorProductos value="" onChange={vi.fn()} />);

    // Assert
    expect(screen.getByLabelText("Buscar")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nombre o marca del producto")).toBeInTheDocument();
  });

  it("muestra el valor recibido por props", () => {
    // Arrange + Act
    render(<BuscadorProductos value="cemento" onChange={vi.fn()} />);

    // Assert
    expect(screen.getByLabelText("Buscar")).toHaveValue("cemento");
  });

  it("llama a onChange cada vez que se escribe", async () => {
    // Arrange
    const onChange = vi.fn();
    render(<BuscadorProductos value="" onChange={onChange} />);

    // Act
    await userEvent.type(screen.getByLabelText("Buscar"), "ce");

    // Assert
    expect(onChange).toHaveBeenCalledTimes(2);
  });
});
