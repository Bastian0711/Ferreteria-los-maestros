import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import CampoTexto from "./CampoTexto";

describe("CampoTexto", () => {
  it("es de tipo texto por defecto", () => {
    // Arrange + Act
    render(<CampoTexto placeholder="Nombre" value="" onChange={vi.fn()} />);

    // Assert
    expect(screen.getByPlaceholderText("Nombre")).toHaveAttribute("type", "text");
  });

  it("acepta otro tipo de campo", () => {
    // Arrange + Act
    render(<CampoTexto type="password" placeholder="Clave" value="" onChange={vi.fn()} />);

    // Assert
    expect(screen.getByPlaceholderText("Clave")).toHaveAttribute("type", "password");
  });

  it("muestra el valor recibido", () => {
    // Arrange + Act
    render(<CampoTexto placeholder="Nombre" value="Camila" onChange={vi.fn()} />);

    // Assert
    expect(screen.getByPlaceholderText("Nombre")).toHaveValue("Camila");
  });

  it("llama a onChange cada vez que se escribe", async () => {
    // Arrange
    const onChange = vi.fn();
    render(<CampoTexto placeholder="Nombre" value="" onChange={onChange} />);

    // Act
    await userEvent.type(screen.getByPlaceholderText("Nombre"), "ab");

    // Assert
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("marca el campo como inválido cuando corresponde", () => {
    // Arrange + Act
    render(<CampoTexto placeholder="Nombre" value="" onChange={vi.fn()} invalido />);

    // Assert
    expect(screen.getByPlaceholderText("Nombre")).toHaveClass("is-invalid");
  });

  it("no tiene la marca de inválido por defecto", () => {
    // Arrange + Act
    render(<CampoTexto placeholder="Nombre" value="" onChange={vi.fn()} />);

    // Assert
    expect(screen.getByPlaceholderText("Nombre")).not.toHaveClass("is-invalid");
  });

  it("puede ser obligatorio", () => {
    // Arrange + Act
    render(<CampoTexto placeholder="Nombre" value="" onChange={vi.fn()} required />);

    // Assert
    expect(screen.getByPlaceholderText("Nombre")).toBeRequired();
  });
});
