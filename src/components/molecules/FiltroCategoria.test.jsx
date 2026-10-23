import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import FiltroCategoria from "./FiltroCategoria";

describe("FiltroCategoria", () => {
  it("muestra la etiqueta por defecto y la opción para ver todas", () => {
    // Arrange + Act
    render(<FiltroCategoria categorias={[]} value="" onChange={vi.fn()} />);

    // Assert
    expect(screen.getByLabelText("Categoría")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Todas las categorías" })).toBeInTheDocument();
  });

  it("acepta categorías como textos", () => {
    // Arrange
    const categorias = ["Gasfitería", "Electricidad"];

    // Act
    render(<FiltroCategoria categorias={categorias} value="" onChange={vi.fn()} />);

    // Assert
    expect(screen.getByRole("option", { name: "Electricidad" }).value).toBe("Electricidad");
  });

  it("acepta categorías como objetos y usa el id como valor", () => {
    // Arrange
    const categorias = [{ id: "gasfiteria", nombre: "Gasfitería" }];

    // Act
    render(<FiltroCategoria categorias={categorias} value="" onChange={vi.fn()} />);

    // Assert
    expect(screen.getByRole("option", { name: "Gasfitería" }).value).toBe("gasfiteria");
  });

  it("llama a onChange al elegir una categoría", async () => {
    // Arrange
    const onChange = vi.fn();
    const categorias = [{ id: "gasfiteria", nombre: "Gasfitería" }];
    render(<FiltroCategoria categorias={categorias} value="" onChange={onChange} />);

    // Act
    await userEvent.selectOptions(screen.getByLabelText("Categoría"), "gasfiteria");

    // Assert
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
