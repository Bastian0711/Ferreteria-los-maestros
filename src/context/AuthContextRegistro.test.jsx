import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { vi } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext";
import { registrarUsuario } from "../services/authService";
import { CLAVE_SESION } from "../services/sesion";
import { crearTokenDePrueba } from "../test/sesionDePrueba";

vi.mock("../services/authService", () => ({ autenticar: vi.fn(), registrarUsuario: vi.fn() }));

const DATOS = { nombre: "Ana", apellidos: "Pérez", correo: "ana@correo.cl", contrasena: "Nueva123!" };
const NUEVA = { id: 7, nombre: "Ana", correo: "ana@correo.cl", rol: "cliente" };

function Panel() {
  const { usuario, registrar } = useAuth();
  const [error, setError] = useState("");

  async function crear() {
    try {
      await registrar(DATOS);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      <p data-testid="correo">{usuario ? usuario.correo : "sin sesión"}</p>
      <p data-testid="error">{error}</p>
      <button onClick={crear}>Crear</button>
    </div>
  );
}

describe("AuthContext.registrar", () => {
  beforeEach(() => {
    registrarUsuario.mockReset();
  });

  it("crea la cuenta y deja la sesión iniciada", async () => {
    // Arrange
    registrarUsuario.mockResolvedValue({ token: crearTokenDePrueba(), usuario: NUEVA });
    render(<AuthProvider><Panel /></AuthProvider>);

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Crear" }));

    // Assert
    expect(await screen.findByText("ana@correo.cl")).toBeInTheDocument();
    expect(JSON.parse(sessionStorage.getItem(CLAVE_SESION)).usuario.correo).toBe("ana@correo.cl");
  });

  it("deja pasar el error y no inicia sesión si el correo ya existe", async () => {
    // Arrange
    registrarUsuario.mockRejectedValue(new Error("Ya existe una cuenta con ese correo."));
    render(<AuthProvider><Panel /></AuthProvider>);

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Crear" }));

    // Assert
    expect(await screen.findByText("Ya existe una cuenta con ese correo.")).toBeInTheDocument();
    expect(screen.getByTestId("correo").textContent).toBe("sin sesión");
  });
});
