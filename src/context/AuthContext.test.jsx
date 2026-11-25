import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext";
import { autenticar } from "../services/authService";
import { CLAVE_SESION } from "../services/sesion";
import { EVENTO_SESION_EXPIRADA } from "../services/api";
import { crearTokenDePrueba, iniciarSesionDePrueba } from "../test/sesionDePrueba";

vi.mock("../services/authService", () => ({ autenticar: vi.fn(), registrarUsuario: vi.fn() }));

const ADMIN = { id: 1, nombre: "Administrador", correo: "admin@maestros.cl", rol: "admin" };
const CLIENTE = { id: 4, nombre: "Camila", correo: "cliente@maestros.cl", rol: "cliente" };

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
    autenticar.mockResolvedValue({ token: crearTokenDePrueba(), usuario: ADMIN });
    renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    // Assert
    expect(autenticar).toHaveBeenCalledWith("alguien@maestros.cl", "Clave123!");
    expect(await screen.findByText("admin@maestros.cl")).toBeInTheDocument();
  });

  it("no inicia sesión cuando las credenciales son inválidas", async () => {
    // Arrange
    autenticar.mockResolvedValue(null);
    renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    // Assert
    expect(screen.getByTestId("correo").textContent).toBe("sin sesión");
  });

  it("esAdmin es verdadero para el administrador", async () => {
    // Arrange
    autenticar.mockResolvedValue({ token: crearTokenDePrueba(), usuario: ADMIN });
    renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    // Assert
    expect(await screen.findByText("true")).toBeInTheDocument();
  });

  it("esAdmin es falso para un cliente", () => {
    // Arrange
    iniciarSesionDePrueba(CLIENTE);

    // Act
    renderizar();

    // Assert
    expect(screen.getByTestId("admin").textContent).toBe("false");
  });

  it("guarda el token y el usuario en sessionStorage al iniciar sesión", async () => {
    // Arrange
    const token = crearTokenDePrueba();
    autenticar.mockResolvedValue({ token, usuario: CLIENTE });
    renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));
    await screen.findByText("cliente@maestros.cl");

    // Assert
    const guardada = JSON.parse(sessionStorage.getItem(CLAVE_SESION));
    expect(guardada.token).toBe(token);
    expect(guardada.usuario.correo).toBe("cliente@maestros.cl");
  });

  it("cierra la sesión y borra lo guardado", async () => {
    // Arrange
    iniciarSesionDePrueba(CLIENTE);
    renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Salir" }));

    // Assert
    expect(screen.getByTestId("correo").textContent).toBe("sin sesión");
    expect(sessionStorage.getItem(CLAVE_SESION)).toBeNull();
  });

  it("recupera la sesión guardada al recargar la página", () => {
    // Arrange
    iniciarSesionDePrueba(CLIENTE);

    // Act
    renderizar();

    // Assert
    expect(screen.getByTestId("correo").textContent).toBe("cliente@maestros.cl");
  });

  it("descarta una sesión guardada con el token vencido", () => {
    // Arrange
    iniciarSesionDePrueba(CLIENTE, -10);

    // Act
    renderizar();

    // Assert
    expect(screen.getByTestId("correo").textContent).toBe("sin sesión");
  });

  it("ignora una sesión guardada con datos corruptos", () => {
    // Arrange
    sessionStorage.setItem(CLAVE_SESION, "{esto no es json");

    // Act
    renderizar();

    // Assert
    expect(screen.getByTestId("correo").textContent).toBe("sin sesión");
  });

  it("cierra la sesión cuando el backend avisa que el token ya no sirve (401)", () => {
    // Arrange
    iniciarSesionDePrueba(CLIENTE);
    renderizar();

    // Act
    act(() => {
      window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
    });

    // Assert
    expect(screen.getByTestId("correo").textContent).toBe("sin sesión");
    expect(sessionStorage.getItem(CLAVE_SESION)).toBeNull();
  });

  it("cierra la sesión sola cuando vence el token", () => {
    // Arrange
    vi.useFakeTimers();
    iniciarSesionDePrueba(CLIENTE, 2);
    renderizar();
    expect(screen.getByTestId("correo").textContent).toBe("cliente@maestros.cl");

    // Act
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Assert
    expect(screen.getByTestId("correo").textContent).toBe("sin sesión");
    vi.useRealTimers();
  });

  it("useAuth funciona sin provider y entrega una sesión vacía", () => {
    // Arrange + Act
    render(<Panel />);

    // Assert
    expect(screen.getByTestId("correo").textContent).toBe("sin sesión");
  });
});
