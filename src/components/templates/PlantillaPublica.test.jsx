import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PlantillaPublica from "./PlantillaPublica";
import { AuthProvider } from "../../context/AuthContext";
import { CatalogoProvider } from "../../context/CatalogoContext";
import { CarritoProvider } from "../../context/CarritoContext";
import { reiniciarBase } from "../../data/baseDatos";

function renderizar() {
  return render(
    <AuthProvider>
      <CatalogoProvider>
        <CarritoProvider>
          <MemoryRouter initialEntries={["/"]}>
            <Routes>
              <Route path="/" element={<PlantillaPublica><p>Contenido</p></PlantillaPublica>} />
              <Route path="/catalogo" element={<p>Pantalla de catálogo</p>} />
            </Routes>
          </MemoryRouter>
        </CarritoProvider>
      </CatalogoProvider>
    </AuthProvider>
  );
}

describe("PlantillaPublica", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  it("muestra la barra de navegación y el contenido", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByText("Ferretería Los Maestros")).toBeInTheDocument();
    expect(screen.getByText("Contenido")).toBeInTheDocument();
  });

  it("muestra el pie de página", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("navega al usar un enlace de la barra", async () => {
    // Arrange
    renderizar();

    // Act
    await userEvent.click(screen.getByText("Catálogo"));

    // Assert
    expect(screen.getByText("Pantalla de catálogo")).toBeInTheDocument();
  });
});
