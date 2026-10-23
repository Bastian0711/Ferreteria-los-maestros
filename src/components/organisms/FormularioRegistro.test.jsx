import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormularioRegistro from "./FormularioRegistro";

async function completar(contrasena = "Nueva123!", repetir = "Nueva123!") {
  await userEvent.type(screen.getByLabelText("Nombre"), "Ana");
  await userEvent.type(screen.getByLabelText("Apellidos"), "Pérez Soto");
  await userEvent.type(screen.getByLabelText("Correo electrónico"), "ana@correo.cl");
  await userEvent.type(screen.getByLabelText("Contraseña"), contrasena);
  await userEvent.type(screen.getByLabelText("Repetir contraseña"), repetir);
}

describe("FormularioRegistro", () => {
  it("muestra los errores de campos obligatorios y no envía", async () => {
    // Arrange
    const onRegistrar = vi.fn();
    render(<FormularioRegistro onRegistrar={onRegistrar} />);

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));

    // Assert
    expect(screen.getByText("El nombre es obligatorio.")).toBeInTheDocument();
    expect(screen.getByText("Los apellidos son obligatorios.")).toBeInTheDocument();
    expect(screen.getByText("El correo es obligatorio.")).toBeInTheDocument();
    expect(screen.getByText("La contraseña es obligatoria.")).toBeInTheDocument();
    expect(onRegistrar).not.toHaveBeenCalled();
  });

  it("avisa cuando las contraseñas no coinciden", async () => {
    // Arrange
    const onRegistrar = vi.fn();
    render(<FormularioRegistro onRegistrar={onRegistrar} />);
    await completar("Nueva123!", "Otra123!");

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));

    // Assert
    expect(screen.getByText("Las contraseñas no coinciden.")).toBeInTheDocument();
    expect(onRegistrar).not.toHaveBeenCalled();
  });

  it("rechaza una contraseña débil", async () => {
    // Arrange
    render(<FormularioRegistro onRegistrar={() => {}} />);
    await completar("corta", "corta");

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));

    // Assert
    expect(screen.getByText("La contraseña debe tener al menos 8 caracteres.")).toBeInTheDocument();
  });

  it("entrega los datos sin la repetición de la contraseña", async () => {
    // Arrange
    const onRegistrar = vi.fn();
    render(<FormularioRegistro onRegistrar={onRegistrar} />);
    await completar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));

    // Assert
    expect(onRegistrar).toHaveBeenCalledWith({
      nombre: "Ana",
      apellidos: "Pérez Soto",
      correo: "ana@correo.cl",
      direccion: "",
      contrasena: "Nueva123!",
    });
  });

  it("muestra el error general que llega por props", () => {
    // Arrange + Act
    render(<FormularioRegistro onRegistrar={() => {}} error="Ya existe una cuenta con ese correo." />);

    // Assert
    expect(screen.getByRole("alert")).toHaveTextContent("Ya existe una cuenta con ese correo.");
  });
});
