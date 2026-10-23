import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormularioLogin from "./FormularioLogin";

describe("FormularioLogin", () => {
  it("exige correo y contraseña y no llama a onLogin", async () => {
    // Arrange
    const onLogin = vi.fn();
    render(<FormularioLogin onLogin={onLogin} />);

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));

    // Assert
    expect(screen.getByText("El correo es obligatorio.")).toBeInTheDocument();
    expect(screen.getByText("La contraseña es obligatoria.")).toBeInTheDocument();
    expect(onLogin).not.toHaveBeenCalled();
  });

  it("rechaza un correo con formato inválido", () => {
    // Arrange
    const onLogin = vi.fn();
    render(<FormularioLogin onLogin={onLogin} />);
    fireEvent.change(screen.getByLabelText("Correo electrónico"), { target: { value: "sin-arroba" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "Clave123!" } });

    // Act
    fireEvent.submit(screen.getByRole("button", { name: "Iniciar sesión" }).closest("form"));

    // Assert
    expect(screen.getByText(/Ingresa un correo válido/)).toBeInTheDocument();
    expect(onLogin).not.toHaveBeenCalled();
  });

  it("rechaza una contraseña débil", async () => {
    // Arrange
    render(<FormularioLogin onLogin={() => {}} />);
    await userEvent.type(screen.getByLabelText("Correo electrónico"), "a@b.cl");
    await userEvent.type(screen.getByLabelText("Contraseña"), "corta");

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));

    // Assert
    expect(screen.getByText("La contraseña debe tener al menos 8 caracteres.")).toBeInTheDocument();
  });

  it("entrega correo y contraseña cuando son válidos", async () => {
    // Arrange
    const onLogin = vi.fn();
    render(<FormularioLogin onLogin={onLogin} />);
    await userEvent.type(screen.getByLabelText("Correo electrónico"), "admin@maestros.cl");
    await userEvent.type(screen.getByLabelText("Contraseña"), "Admin123!");

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));

    // Assert
    expect(onLogin).toHaveBeenCalledWith({ correo: "admin@maestros.cl", contrasena: "Admin123!" });
  });

  it("muestra el error que llega por props", () => {
    // Arrange + Act
    render(<FormularioLogin onLogin={() => {}} error="Correo o contraseña incorrectos." />);

    // Assert
    expect(screen.getByRole("alert")).toHaveTextContent("Correo o contraseña incorrectos.");
  });
});
