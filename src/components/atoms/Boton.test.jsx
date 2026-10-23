import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Boton from "./Boton";

describe("Boton", () => {
  it("muestra el texto recibido", () => {
    // Arrange + Act
    render(<Boton texto="Guardar" />);

    // Assert
    expect(screen.getByRole("button", { name: "Guardar" })).toBeInTheDocument();
  });

  it("usa la variante primary por defecto", () => {
    // Arrange + Act
    render(<Boton texto="Guardar" />);

    // Assert
    expect(screen.getByRole("button")).toHaveClass("btn", "btn-primary");
  });

  it("usa la variante indicada", () => {
    // Arrange + Act
    render(<Boton texto="Quitar" variante="outline-danger" />);

    // Assert
    expect(screen.getByRole("button")).toHaveClass("btn-outline-danger");
  });

  it("es de tipo button por defecto y acepta type submit", () => {
    // Arrange + Act
    const { rerender } = render(<Boton texto="Uno" />);
    const tipoPorDefecto = screen.getByRole("button").getAttribute("type");
    rerender(<Boton texto="Uno" type="submit" />);

    // Assert
    expect(tipoPorDefecto).toBe("button");
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("llama a onClick una vez al pulsarlo", async () => {
    // Arrange
    const onClick = vi.fn();
    render(<Boton texto="Guardar" onClick={onClick} />);

    // Act
    await userEvent.click(screen.getByRole("button"));

    // Assert
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("no llama a onClick cuando está deshabilitado", async () => {
    // Arrange
    const onClick = vi.fn();
    render(<Boton texto="Guardar" onClick={onClick} disabled />);

    // Act
    await userEvent.click(screen.getByRole("button"));

    // Assert
    expect(screen.getByRole("button")).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });
});
