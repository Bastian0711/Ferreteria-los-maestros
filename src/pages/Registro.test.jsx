import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi } from "vitest";
import Registro from "./Registro";
import { AuthProvider } from "../context/AuthContext";
import { registrarUsuario } from "../services/authService";
import { CLAVE_SESION } from "../services/sesion";
import { crearTokenDePrueba } from "../test/sesionDePrueba";

vi.mock("../services/authService", () => ({ autenticar: vi.fn(), registrarUsuario: vi.fn() }));

const NUEVA = { id: 7, nombre: "Ana", apellidos: "Pérez Soto", correo: "ana@correo.cl", rol: "cliente" };

function renderizar() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/registro"]}>
        <Routes>
          <Route path="/registro" element={<Registro />} />
          <Route path="/catalogo" element={<p>Pantalla de catálogo</p>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

async function completar(correo) {
  await userEvent.type(screen.getByLabelText("Nombre"), "Ana");
  await userEvent.type(screen.getByLabelText("Apellidos"), "Pérez Soto");
  await userEvent.type(screen.getByLabelText("Correo electrónico"), correo);
  await userEvent.type(screen.getByLabelText("Contraseña"), "Nueva123!");
  await userEvent.type(screen.getByLabelText("Repetir contraseña"), "Nueva123!");
  await userEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));
}

describe("Registro", () => {
  beforeEach(() => {
    registrarUsuario.mockReset();
  });

  it("fija el título de la pestaña", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(document.title).toBe("Crear cuenta | Ferretería Los Maestros");
  });

  it("crea la cuenta, inicia sesión y lleva al catálogo", async () => {
    // Arrange
    registrarUsuario.mockResolvedValue({ token: crearTokenDePrueba(), usuario: NUEVA });
    renderizar();

    // Act
    await completar("ana@correo.cl");

    // Assert
    expect(await screen.findByText("Pantalla de catálogo")).toBeInTheDocument();
    expect(registrarUsuario).toHaveBeenCalledWith(expect.objectContaining({ correo: "ana@correo.cl", contrasena: "Nueva123!" }));
    expect(JSON.parse(sessionStorage.getItem(CLAVE_SESION)).usuario.correo).toBe("ana@correo.cl");
  });

  it("muestra un error si el correo ya está registrado", async () => {
    // Arrange
    registrarUsuario.mockRejectedValue(new Error("Ya existe una cuenta con ese correo."));
    renderizar();

    // Act
    await completar("cliente@maestros.cl");

    // Assert
    expect(await screen.findByRole("alert")).toHaveTextContent("Ya existe una cuenta con ese correo.");
    expect(screen.queryByText("Pantalla de catálogo")).not.toBeInTheDocument();
  });

  it("deshabilita el botón mientras se crea la cuenta", async () => {
    // Arrange
    registrarUsuario.mockReturnValue(new Promise(() => {}));
    renderizar();

    // Act
    await completar("ana@correo.cl");

    // Assert
    expect(await screen.findByRole("button", { name: "Creando cuenta..." })).toBeDisabled();
  });
});
