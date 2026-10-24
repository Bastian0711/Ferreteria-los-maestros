import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Catalogo from "./Catalogo";
import DetalleProducto from "./DetalleProducto";
import { CatalogoProvider } from "../context/CatalogoContext";
import { CarritoProvider } from "../context/CarritoContext";
import { reiniciarBase } from "../data/baseDatos";

function renderizar(ruta) {
  return render(
    <CatalogoProvider>
      <CarritoProvider>
        <MemoryRouter initialEntries={[ruta]}>
          <Routes>
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/producto/:codigo" element={<DetalleProducto />} />
          </Routes>
        </MemoryRouter>
      </CarritoProvider>
    </CatalogoProvider>
  );
}

describe("Stock que baja al agregar al carrito", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  it("en el catálogo, el stock de la tarjeta baja al agregar", async () => {
    // Arrange
    renderizar("/catalogo");
    const tarjeta = screen.getByText("Cemento Melón blanco 25 kg").closest(".card");
    expect(within(tarjeta).getByText("Stock: 40")).toBeInTheDocument();

    // Act
    await userEvent.click(within(tarjeta).getByRole("button", { name: "Agregar" }));

    // Assert
    expect(within(tarjeta).getByText("Stock: 39")).toBeInTheDocument();
  });

  it("en el detalle, el stock de la ficha baja al agregar", async () => {
    // Arrange
    renderizar("/producto/MC002");
    expect(screen.getByText("Stock: 40")).toBeInTheDocument();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Agregar a la solicitud" }));

    // Assert
    expect(screen.getByText("Stock: 39")).toBeInTheDocument();
  });
});
