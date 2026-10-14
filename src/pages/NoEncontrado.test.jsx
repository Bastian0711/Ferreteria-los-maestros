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
  it("muestra el 404 en una ruta inexistente", () => {
    renderizar("/ruta-que-no-existe");
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Página no encontrada" })).toBeInTheDocument();
    expect(document.title).toBe("Página no encontrada | Ferretería Los Maestros");
  });

  it("el botón vuelve al inicio", async () => {
    renderizar("/ruta-que-no-existe");
    await userEvent.click(screen.getByRole("button", { name: "Volver al inicio" }));
    expect(screen.getByText("Pantalla de inicio")).toBeInTheDocument();
  });
});