import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Ofertas from "./Ofertas";
import { CatalogoProvider } from "../context/CatalogoContext";
import { CarritoProvider } from "../context/CarritoContext";
import { reiniciarBase } from "../data/baseDatos";
import { PRODUCTOS_SEMILLA } from "../data/productosSemilla";

const OFERTAS_ESPERADAS = PRODUCTOS_SEMILLA.filter((p) => p.oferta && p.precioOferta);

function renderizar() {
  return render(
    <CatalogoProvider>
      <CarritoProvider>
        <MemoryRouter initialEntries={["/ofertas"]}>
          <Routes>
            <Route path="/ofertas" element={<Ofertas />} />
            <Route path="/producto/:codigo" element={<p>Pantalla de detalle</p>} />
          </Routes>
        </MemoryRouter>
      </CarritoProvider>
    </CatalogoProvider>
  );
}

describe("Ofertas", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  it("actualiza el título de la página y muestra el encabezado", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(document.title).toBe("Ofertas | Ferretería Los Maestros");
    expect(screen.getByRole("heading", { name: "Ofertas" })).toBeInTheDocument();
  });

  it("muestra solo los productos que están en oferta", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByText(`${OFERTAS_ESPERADAS.length} productos en oferta`)).toBeInTheDocument();
    expect(screen.getByText("Cemento Polpaico gris 25 kg")).toBeInTheDocument();
    expect(screen.queryByText("Cemento Melón blanco 25 kg")).not.toBeInTheDocument();
  });

  it("avisa al agregar un producto a la solicitud", async () => {
    // Arrange
    renderizar();

    // Act
    await userEvent.click(screen.getAllByRole("button", { name: /agregar/i })[0]);

    // Assert
    expect(screen.getByRole("alert")).toHaveTextContent("se agregó a tu solicitud");
  });
});