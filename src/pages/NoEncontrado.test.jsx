import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import NoEncontrado from "./NoEncontrado";

function renderizar(ruta) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/" element={<p>Pantalla de inicio</p>} />
        <Route path="*" element={<NoEncontrado />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("NoEncontrado", () => {
  it("muestra el código 404 en una ruta inexistente", () => {
    // Arrange
    const rutaInexistente = "/ruta-que-no-existe";

    // Act
    renderizar(rutaInexistente);

    // Assert
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("muestra el título de página no encontrada", () => {
    // Arrange
    const rutaInexistente = "/ruta-que-no-existe";

    // Act
    renderizar(rutaInexistente);

    // Assert
    expect(
      screen.getByRole("heading", { name: "Página no encontrada" })
    ).toBeInTheDocument();
  });

  it("actualiza el título del documento", () => {
    // Arrange
    const rutaInexistente = "/ruta-que-no-existe";

    // Act
    renderizar(rutaInexistente);

    // Assert
    expect(document.title).toBe("Página no encontrada | Ferretería Los Maestros");
  });

  it("el botón vuelve al inicio", async () => {
    // Arrange
    renderizar("/ruta-que-no-existe");

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Volver al inicio" }));

    // Assert
    expect(screen.getByText("Pantalla de inicio")).toBeInTheDocument();
  });
});