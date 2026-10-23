import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PlantillaAdmin from "./PlantillaAdmin";

function renderizar() {
  return render(
    <MemoryRouter initialEntries={["/admin/productos"]}>
      <Routes>
        <Route
          path="/admin/productos"
          element={
            <PlantillaAdmin>
              <p>Contenido del panel</p>
            </PlantillaAdmin>
          }
        />
        <Route path="/" element={<p>Pantalla de inicio</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("PlantillaAdmin", () => {
  it("muestra el encabezado y el contenido recibido", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByText("Panel de administración")).toBeInTheDocument();
    expect(screen.getByText("Contenido del panel")).toBeInTheDocument();
  });

  it("al cerrar sesión lleva al inicio", async () => {
    // Arrange
    renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));

    // Assert
    expect(screen.getByText("Pantalla de inicio")).toBeInTheDocument();
  });
});
