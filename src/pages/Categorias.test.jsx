import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Categorias from "./Categorias";
import { CatalogoProvider } from "../context/CatalogoContext";
import { CarritoProvider } from "../context/CarritoContext";
import { reiniciarBase } from "../data/baseDatos";

function renderizar() {
  return render(
    <CatalogoProvider>
      <CarritoProvider>
        <MemoryRouter initialEntries={["/categorias"]}>
          <Routes>
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/categoria/:id" element={<p>Pantalla de una categoría</p>} />
          </Routes>
        </MemoryRouter>
      </CarritoProvider>
    </CatalogoProvider>
  );
}

describe("Categorias", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  it("muestra el encabezado y actualiza el título de la página", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByRole("heading", { name: "Categorías" })).toBeInTheDocument();
    expect(document.title).toBe("Categorías | Ferretería Los Maestros");
  });

  it("muestra un botón por cada categoría del catálogo", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByRole("button", { name: "Gasfitería" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Madera y Tableros" })).toBeInTheDocument();
  });

  it("lleva a la página de la categoría elegida", async () => {
    // Arrange
    renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Gasfitería" }));

    // Assert
    expect(screen.getByText("Pantalla de una categoría")).toBeInTheDocument();
  });
});