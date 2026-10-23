import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext";
import { autenticar } from "../services/authService";


vi.mock("../services/authService", () => ({ autenticar: vi.fn() }));

const ADMIN = { id: 1, nombre: "Administrador", correo: "admin@maestros.cl", rol: "admin" };
const CLIENTE = { id: 3, nombre: "Camila", correo: "cliente@maestros.cl", rol: "cliente" };

function Panel() {
  const { usuario, esAdmin, iniciarSesion, cerrarSesion } = useAuth();

  return (
    <div>
      <p data-testid="correo">{usuario ? usuario.correo : "sin sesión"}</p>
      <p data-testid="admin">{String(esAdmin)}</p>
      <button onClick={() => iniciarSesion("alguien@maestros.cl", "Clave123!")}>Entrar</button>
      <button onClick={cerrarSesion}>Salir</button>
    </div>
  );
}

function renderizar() {
  return render(
    <AuthProvider>
      <Panel />
    </AuthProvider>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    autenticar.mockReset();
  });

  it("empieza sin sesión", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByTestId("correo").textContent).toBe("sin sesión");
    expect(screen.getByTestId("admin").textContent).toBe("false");
  });

  it("inicia sesión cuando las credenciales son válidas", async () => {
    // Arrange
    autenticar.mockReturnValue(ADMIN);
    renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    // Assert
    expect(autenticar).toHaveBeenCalledWith("alguien@maestros.cl", "Clave123!");
    expect(screen.getByTestId("correo").textContent).toBe("admin@maestros.cl");
  });

  it("no inicia sesión cuando las credenciales son inválidas", async () => {
    // Arrange
    autenticar.mockReturnValue(null);
    renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    // Assert
    expect(screen.getByTestId("correo").textContent).toBe("sin sesión");
  });

  it("esAdmin es verdadero para el administrador", async () => {
    // Arrange
    autenticar.mockReturnValue(ADMIN);
    renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    // Assert
    expect(screen.getByTestId("admin").textContent).toBe("true");
  });

  it("esAdmin es falso para un cliente", async () => {
    // Arrange
    autenticar.mockReturnValue(CLIENTE);
    renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    // Assert
    expect(screen.getByTestId("admin").textContent).toBe("false");
  });

  it("guarda la sesión en localStorage al iniciar sesión", async () => {
    // Arrange
    autenticar.mockReturnValue(ADMIN);
    renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    // Assert
    const guardada = JSON.parse(localStorage.getItem("ferreteria_sesion"));
    expect(guardada.correo).toBe("admin@maestros.cl");
  });

  it("cierra la sesión y borra lo guardado", async () => {
    // Arrange
    autenticar.mockReturnValue(ADMIN);
    renderizar();
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Salir" }));

    // Assert
    expect(screen.getByTestId("correo").textContent).toBe("sin sesión");
    expect(localStorage.getItem("ferreteria_sesion")).toBeNull();
  });

  it("recupera la sesión guardada al cargar la página", () => {
    // Arrange
    localStorage.setItem("ferreteria_sesion", JSON.stringify(CLIENTE));

    // Act
    renderizar();

    // Assert
    expect(screen.getByTestId("correo").textContent).toBe("cliente@maestros.cl");
  });

  it("ignora una sesión guardada con datos corruptos", () => {
    // Arrange
    localStorage.setItem("ferreteria_sesion", "{esto no es json");

    // Act
    renderizar();

    // Assert
    expect(screen.getByTestId("correo").textContent).toBe("sin sesión");
  });

  it("useAuth funciona sin provider y entrega una sesión vacía", () => {
    // Arrange + Act
    render(<Panel />);

    // Assert
    expect(screen.getByTestId("correo").textContent).toBe("sin sesión");
  });
});
