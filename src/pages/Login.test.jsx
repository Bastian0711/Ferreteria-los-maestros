import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import { AuthProvider } from "../context/AuthContext";
import { reiniciarBase } from "../data/baseDatos";

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
    localStorage.clear();
    reiniciarBase();
  });

  it("muestra un error si las credenciales no existen", async () => {
    // Arrange
    renderizar();

    // Act
    await iniciar("admin@maestros.cl", "Equivocada123!");

    // Assert
    expect(await screen.findByRole("alert")).toHaveTextContent("Correo o contraseña incorrectos.");
  });

  it("lleva al administrador al panel", async () => {
    // Arrange
    renderizar();

    // Act
    await iniciar("admin@maestros.cl", "Admin123!");

    // Assert
    expect(await screen.findByText("Pantalla de admin")).toBeInTheDocument();
  });

  it("lleva al cliente al catálogo", async () => {
    // Arrange
    renderizar();

    // Act
    await iniciar("cliente@maestros.cl", "Cliente123!");

    // Assert
    expect(await screen.findByText("Pantalla de catálogo")).toBeInTheDocument();
  });

  it("guarda la sesión en localStorage", async () => {
    // Arrange
    renderizar();

    // Act
    await iniciar("cliente@maestros.cl", "Cliente123!");
    await screen.findByText("Pantalla de catálogo");

    // Assert
    expect(JSON.parse(localStorage.getItem("ferreteria_sesion")).correo).toBe("cliente@maestros.cl");
  });
});
