import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Categoria from "./Categoria";
import { CatalogoProvider } from "../context/CatalogoContext";
import { CarritoProvider } from "../context/CarritoContext";
import { reiniciarBase } from "../data/baseDatos";

function renderizar(ruta) {
  return render(
    <CatalogoProvider>
      <CarritoProvider>
        <MemoryRouter initialEntries={[ruta]}>
          <Routes>
            <Route path="/categoria/:id" element={<Categoria />} />
            <Route path="/categorias" element={<p>Pantalla de categorías</p>} />
            <Route path="/producto/:codigo" element={<p>Pantalla de detalle</p>} />
          </Routes>
        </MemoryRouter>
      </CarritoProvider>
    </CatalogoProvider>
  );
}

describe("Categoria", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  it("lee el id de la dirección y muestra el nombre y la cantidad de productos", () => {
    // Arrange + Act
    renderizar("/categoria/gasfiteria");

    // Assert
    expect(screen.getByRole("heading", { name: "Gasfitería" })).toBeInTheDocument();
    expect(screen.getByText("12 productos")).toBeInTheDocument();
    expect(document.title).toBe("Gasfitería | Ferretería Los Maestros");
  });

  it("muestra solo los productos de esa categoría", () => {
    // Arrange + Act
    renderizar("/categoria/materiales-construccion");

    // Assert
    expect(screen.getByText("Cemento Polpaico gris 25 kg")).toBeInTheDocument();
    expect(screen.queryByText("Taladro percutor 650W 13mm")).not.toBeInTheDocument();
  });

  it("avisa cuando la categoría no existe y permite volver a las categorías", async () => {
    // Arrange
    renderizar("/categoria/no-existe");

    // Act
    expect(screen.getByText("Categoría no encontrada")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Ver categorías" }));

    // Assert
    expect(screen.getByText("Pantalla de categorías")).toBeInTheDocument();
  });

  it("avisa al agregar un producto a la solicitud", async () => {
    // Arrange
    renderizar("/categoria/gasfiteria");

    // Act
    await userEvent.click(screen.getAllByRole("button", { name: /agregar/i })[0]);

    // Assert
    expect(screen.getByRole("alert")).toHaveTextContent("se agregó a tu solicitud");
  });
});