import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormularioContacto from "./FormularioContacto";

describe("FormularioContacto", () => {
  it("muestra errores de campos obligatorios y no envía", async () => {
    // Arrange
    const onEnviar = vi.fn();
    render(<FormularioContacto onEnviar={onEnviar} />);

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    // Assert
    expect(screen.getByText("El nombre es obligatorio.")).toBeInTheDocument();
    expect(screen.getByText("El correo es obligatorio.")).toBeInTheDocument();
    expect(screen.getByText("El mensaje es obligatorio.")).toBeInTheDocument();
    expect(onEnviar).not.toHaveBeenCalled();
  });

  it("rechaza un correo inválido", async () => {
    // Arrange
    render(<FormularioContacto onEnviar={() => {}} />);
    await userEvent.type(screen.getByLabelText("Nombre"), "Ana");
    await userEvent.type(screen.getByLabelText("Correo electrónico"), "correo-malo");
    await userEvent.type(screen.getByLabelText("Mensaje"), "Hola");

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    // Assert
    expect(screen.getByText(/Ingresa un correo válido/)).toBeInTheDocument();
  });

  it("envía los datos y limpia el formulario", async () => {
    // Arrange
    const onEnviar = vi.fn();
    render(<FormularioContacto onEnviar={onEnviar} />);
    await userEvent.type(screen.getByLabelText("Nombre"), "Ana");
    await userEvent.type(screen.getByLabelText("Correo electrónico"), "ana@correo.cl");
    await userEvent.type(screen.getByLabelText("Mensaje"), "Cotización de cemento");

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    // Assert
    expect(onEnviar).toHaveBeenCalledWith({
      nombre: "Ana",
      correo: "ana@correo.cl",
      mensaje: "Cotización de cemento",
    });
    expect(screen.getByLabelText("Nombre")).toHaveValue("");
    expect(screen.getByLabelText("Mensaje")).toHaveValue("");
  });
});
