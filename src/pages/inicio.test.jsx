import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import Inicio from "./Inicio";
import { AuthProvider } from "../context/AuthContext";
import { CatalogoProvider } from "../context/CatalogoContext";
import { CarritoProvider } from "../context/CarritoContext";
import { reiniciarBase } from "../data/baseDatos";

// Muestra la dirección a la que se navegó, para comprobar los enlaces de la portada.
function UbicacionActual() {
  const ubicacion = useLocation();
  return <p>{`Destino: ${ubicacion.pathname}${ubicacion.search}`}</p>;
}

function renderizar() {
  return render(
    <AuthProvider>
      <CatalogoProvider>
        <CarritoProvider>
          <MemoryRouter initialEntries={["/"]}>
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="*" element={<UbicacionActual />} />
            </Routes>
          </MemoryRouter>
        </CarritoProvider>
      </CatalogoProvider>
    </AuthProvider>
  );
}

describe("Inicio", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  it("muestra el título de la tienda y fija el título de la pestaña", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByRole("heading", { level: 1, name: "Ferretería Los Maestros" })).toBeInTheDocument();
    expect(document.title).toBe("Inicio | Ferretería Los Maestros");
  });

  it("muestra las categorías, las ofertas y los destacados", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByRole("heading", { name: "Categorías" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Gasfitería" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ofertas" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Productos destacados" })).toBeInTheDocument();
  });

  it("lleva al catálogo filtrado al elegir una categoría", async () => {
    // Arrange
    renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Gasfitería" }));

    // Assert
    expect(screen.getByText("Destino: /catalogo?categoria=gasfiteria")).toBeInTheDocument();
  });

  it("avisa al agregar un producto al carrito", async () => {
    // Arrange
    renderizar();

    // Act
    await userEvent.click(screen.getAllByRole("button", { name: "Agregar" })[0]);

    // Assert
    expect(screen.getByText(/se agregó a tu solicitud/)).toBeInTheDocument();
  });

  it("ofrece ver el catálogo desde la portada", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByRole("link", { name: "Ver catálogo" })).toBeInTheDocument();
  });

  it("no ofrece iniciar sesión cuando ya hay una sesión", () => {
    // Arrange
    const cliente = { id: 3, nombre: "Camila", correo: "cliente@maestros.cl", rol: "cliente" };
    localStorage.setItem("ferreteria_sesion", JSON.stringify(cliente));

    // Act
    renderizar();

    // Assert
    expect(screen.queryByRole("link", { name: "Iniciar sesión" })).not.toBeInTheDocument();
  });
});
