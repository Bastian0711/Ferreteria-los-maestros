import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi } from "vitest";
import Login from "./Login";
import { AuthProvider } from "../context/AuthContext";
import { autenticar } from "../services/authService";
import { CLAVE_SESION } from "../services/sesion";
import { crearTokenDePrueba } from "../test/sesionDePrueba";

// Se simula el servicio: la página no llama al backend real durante la prueba
vi.mock("../services/authService", () => ({ autenticar: vi.fn(), registrarUsuario: vi.fn() }));

const ADMIN = { id: 1, nombre: "Administrador", correo: "admin@maestros.cl", rol: "admin" };
const CLIENTE = { id: 4, nombre: "Camila", correo: "cliente@maestros.cl", rol: "cliente" };

function renderizar() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/catalogo" element={<p>Pantalla de catálogo</p>} />
          <Route path="/admin/productos" element={<p>Pantalla de admin</p>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

async function iniciar(correo, contrasena) {
  await userEvent.type(screen.getByLabelText("Correo electrónico"), correo);
  await userEvent.type(screen.getByLabelText("Contraseña"), contrasena);
  await userEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
}

describe("Login", () => {
  beforeEach(() => {
    autenticar.mockReset();
  });

  it("muestra un error si las credenciales no son válidas", async () => {
    // Arrange
    autenticar.mockResolvedValue(null);
    renderizar();

    // Act
    await iniciar("admin@maestros.cl", "Equivocada123!");

    // Assert
    expect(await screen.findByRole("alert")).toHaveTextContent("Correo o contraseña incorrectos.");
  });

  it("lleva al administrador al panel", async () => {
    // Arrange
    autenticar.mockResolvedValue({ token: crearTokenDePrueba(), usuario: ADMIN });
    renderizar();

    // Act
    await iniciar("admin@maestros.cl", "Admin123!");

    // Assert
    expect(await screen.findByText("Pantalla de admin")).toBeInTheDocument();
  });

  it("lleva al cliente al catálogo", async () => {
    // Arrange
    autenticar.mockResolvedValue({ token: crearTokenDePrueba(), usuario: CLIENTE });
    renderizar();

    // Act
    await iniciar("cliente@maestros.cl", "Cliente123!");

    // Assert
    expect(await screen.findByText("Pantalla de catálogo")).toBeInTheDocument();
  });

  it("guarda la sesión en sessionStorage", async () => {
    // Arrange
    autenticar.mockResolvedValue({ token: crearTokenDePrueba(), usuario: CLIENTE });
    renderizar();

    // Act
    await iniciar("cliente@maestros.cl", "Cliente123!");
    await screen.findByText("Pantalla de catálogo");

    // Assert
    expect(JSON.parse(sessionStorage.getItem(CLAVE_SESION)).usuario.correo).toBe("cliente@maestros.cl");
  });

  it("muestra el error si no hay conexión con el servidor", async () => {
    // Arrange
    autenticar.mockRejectedValue(new Error("No pudimos conectar con el servidor. Revisa tu conexión e inténtalo nuevamente."));
    renderizar();

    // Act
    await iniciar("cliente@maestros.cl", "Cliente123!");

    // Assert
    expect(await screen.findByRole("alert")).toHaveTextContent("No pudimos conectar con el servidor");
  });

  it("deshabilita el botón mientras espera la respuesta", async () => {
    // Arrange: la promesa no se resuelve, así la página queda esperando
    autenticar.mockReturnValue(new Promise(() => {}));
    renderizar();

    // Act
    await iniciar("cliente@maestros.cl", "Cliente123!");

    // Assert
    expect(await screen.findByRole("button", { name: "Ingresando..." })).toBeDisabled();
  });
});
