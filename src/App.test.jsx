import { render, screen } from "@testing-library/react";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CatalogoProvider } from "./context/CatalogoContext";
import { CarritoProvider } from "./context/CarritoContext";
import { reiniciarBase } from "./data/baseDatos";

const ADMIN = { id: 1, nombre: "Administrador", correo: "admin@maestros.cl", rol: "admin" };
const CLIENTE = { id: 3, nombre: "Camila", correo: "cliente@maestros.cl", rol: "cliente" };

function abrir(ruta) {
  window.history.pushState({}, "", ruta);
  return render(
    <AuthProvider>
      <CatalogoProvider>
        <CarritoProvider>
          <App />
        </CarritoProvider>
      </CatalogoProvider>
    </AuthProvider>
  );
}

describe("App - rutas", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  it("muestra la portada en /", () => {
    // Arrange + Act
    abrir("/");

    // Assert
    expect(screen.getByRole("heading", { level: 1, name: "Ferretería Los Maestros" })).toBeInTheDocument();
  });

  it("muestra el catálogo en /catalogo", () => {
    // Arrange + Act
    abrir("/catalogo");

    // Assert
    expect(screen.getByRole("heading", { level: 1, name: "Catálogo" })).toBeInTheDocument();
  });

  it("muestra la página 404 en una ruta que no existe", () => {
    // Arrange + Act
    abrir("/ruta-que-no-existe");

    // Assert
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("lleva al login si se entra al panel sin sesión", () => {
    // Arrange + Act
    abrir("/admin/productos");

    // Assert
    expect(screen.getByRole("heading", { name: "Iniciar sesión" })).toBeInTheDocument();
  });

  it("lleva a la portada si un cliente intenta entrar al panel", () => {
    // Arrange
    localStorage.setItem("ferreteria_sesion", JSON.stringify(CLIENTE));

    // Act
    abrir("/admin");

    // Assert
    expect(screen.getByRole("heading", { level: 1, name: "Ferretería Los Maestros" })).toBeInTheDocument();
  });

  it("deja entrar al administrador al resumen", () => {
    // Arrange
    localStorage.setItem("ferreteria_sesion", JSON.stringify(ADMIN));

    // Act
    abrir("/admin");

    // Assert
    expect(screen.getByRole("heading", { level: 1, name: "Resumen" })).toBeInTheDocument();
  });

  it("muestra el formulario de registro en /registro", () => {
    // Arrange + Act
    abrir("/registro");

    // Assert
    expect(screen.getByRole("heading", { name: "Crear cuenta" })).toBeInTheDocument();
  });
});
