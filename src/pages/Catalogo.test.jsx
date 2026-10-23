import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Catalogo from "./Catalogo";
import { CatalogoProvider } from "../context/CatalogoContext";
import { CarritoProvider } from "../context/CarritoContext";
import { reiniciarBase } from "../data/baseDatos";

function renderizar() {
  return render(
    <CatalogoProvider>
      <CarritoProvider>
        <MemoryRouter initialEntries={["/catalogo"]}>
          <Routes>
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/producto/:codigo" element={<p>Pantalla de detalle</p>} />
          </Routes>
        </MemoryRouter>
      </CarritoProvider>
    </CatalogoProvider>
  );
}

describe("Catalogo", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  it("muestra los 85 productos y actualiza el título de la página", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByText("85 productos")).toBeInTheDocument();
    expect(document.title).toBe("Catálogo | Ferretería Los Maestros");
  });

  it("filtra los productos al escribir en el buscador", async () => {
    // Arrange
    renderizar();

    // Act
    await userEvent.type(screen.getByLabelText("Buscar"), "cemento");

    // Assert
    expect(screen.getByText("2 productos")).toBeInTheDocument();
    expect(screen.getByText("Cemento Polpaico gris 25 kg")).toBeInTheDocument();
    expect(screen.queryByText("Taladro percutor 650W 13mm")).not.toBeInTheDocument();
  });

  it("filtra los productos al elegir una categoría", async () => {
    // Arrange
    renderizar();

    // Act
    await userEvent.selectOptions(screen.getByLabelText("Categoría"), "gasfiteria");

    // Assert
    expect(screen.getByText("12 productos")).toBeInTheDocument();
  });

  it("muestra un mensaje cuando ningún producto coincide", async () => {
    // Arrange
    renderizar();

    // Act
    await userEvent.type(screen.getByLabelText("Buscar"), "zzzz");

    // Assert
    expect(screen.getByText("No encontramos productos con esos filtros.")).toBeInTheDocument();
  });

  it("limpia los filtros con el botón Limpiar filtros", async () => {
    // Arrange
    renderizar();
    await userEvent.type(screen.getByLabelText("Buscar"), "cemento");

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Limpiar filtros" }));

    // Assert
    expect(screen.getByText("85 productos")).toBeInTheDocument();
  });

  it("deja el botón Limpiar filtros deshabilitado cuando no hay filtros", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByRole("button", { name: "Limpiar filtros" })).toBeDisabled();
  });

  it("avisa y sube la insignia del carrito al agregar un producto", async () => {
    // Arrange
    renderizar();

    // Act
    await userEvent.click(screen.getAllByRole("button", { name: "Agregar" })[0]);

    // Assert
    expect(await screen.findByText(/se agregó a tu solicitud/)).toBeInTheDocument();
    expect(screen.getByLabelText("1 productos en el carrito")).toBeInTheDocument();
  });

  it("lleva al detalle al pulsar el nombre de un producto", async () => {
    // Arrange
    renderizar();

    // Act
    await userEvent.click(screen.getByRole("link", { name: "Cemento Polpaico gris 25 kg" }));

    // Assert
    expect(screen.getByText("Pantalla de detalle")).toBeInTheDocument();
  });
});
