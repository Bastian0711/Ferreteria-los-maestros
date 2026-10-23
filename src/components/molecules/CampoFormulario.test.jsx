import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import CampoFormulario from "./CampoFormulario";

function renderizar(extra = {}) {
  const props = { id: "correo", label: "Correo electrónico", value: "", onChange: vi.fn(), ...extra };
  render(<CampoFormulario {...props} />);
  return props;
}

describe("CampoFormulario", () => {
  it("asocia la etiqueta con el campo", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByLabelText("Correo electrónico")).toBeInTheDocument();
  });

  it("muestra el mensaje de error y marca el campo como inválido", () => {
    // Arrange + Act
    renderizar({ error: "El correo es obligatorio." });

    // Assert
    expect(screen.getByText("El correo es obligatorio.")).toBeInTheDocument();
    expect(screen.getByLabelText("Correo electrónico")).toHaveClass("is-invalid");
  });

  it("no muestra errores cuando no hay error", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByLabelText("Correo electrónico")).not.toHaveClass("is-invalid");
  });

  it("llama a onChange al escribir", async () => {
    // Arrange
    const props = renderizar();

    // Act
    await userEvent.type(screen.getByLabelText("Correo electrónico"), "a");

    // Assert
    expect(props.onChange).toHaveBeenCalledTimes(1);
  });

  it("usa el tipo de campo indicado", () => {
    // Arrange + Act
    renderizar({ type: "password", label: "Contraseña", id: "clave" });

    // Assert
    expect(screen.getByLabelText("Contraseña")).toHaveAttribute("type", "password");
  });
});
