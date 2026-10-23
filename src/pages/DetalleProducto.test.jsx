import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
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
            <Route path="/producto/:codigo" element={<DetalleProducto />} />
            <Route path="/catalogo" element={<p>Pantalla de catálogo</p>} />
          </Routes>
        </MemoryRouter>
      </CarritoProvider>
    </CatalogoProvider>
  );
}

describe("DetalleProducto", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  it("muestra la ficha del producto y su categoría", () => {
    // Arrange + Act
    renderizar("/producto/MC001");

    // Assert
    expect(screen.getByRole("heading", { name: "Cemento Polpaico gris 25 kg" })).toBeInTheDocument();
    expect(screen.getByText("Materiales de Construcción")).toBeInTheDocument();
  });

  it("actualiza el título de la página con el nombre del producto", () => {
    // Arrange + Act
    renderizar("/producto/MC001");

    // Assert
    expect(document.title).toBe("Cemento Polpaico gris 25 kg | Ferretería Los Maestros");
  });

  it("agrega el producto al carrito y avisa en pantalla", async () => {
    // Arrange
    renderizar("/producto/MC002");

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Agregar a la solicitud" }));

    // Assert
    expect(await screen.findByText("Agregaste 1 a tu solicitud.")).toBeInTheDocument();
    expect(screen.getByLabelText("1 productos en el carrito")).toBeInTheDocument();
  });

  it("muestra el error cuando el código no existe", () => {
    // Arrange + Act
    renderizar("/producto/NO-EXISTE");

    // Assert
    expect(screen.getByRole("heading", { name: "Producto no encontrado" })).toBeInTheDocument();
  });

  it("vuelve al catálogo desde el mensaje de producto no encontrado", async () => {
    // Arrange
    renderizar("/producto/NO-EXISTE");

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Volver al catálogo" }));

    // Assert
    expect(screen.getByText("Pantalla de catálogo")).toBeInTheDocument();
  });
});
