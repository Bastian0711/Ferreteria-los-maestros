import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RutaProtegida from "./RutaProtegida";
import { useAuth } from "../context/AuthContext";

vi.mock("../context/AuthContext", () => ({ useAuth: vi.fn() }));

function renderizar(rolRequerido) {
  return render(
    <MemoryRouter initialEntries={["/secreto"]}>
      <Routes>
        <Route
          path="/secreto"
          element={
            <RutaProtegida rolRequerido={rolRequerido}>
              <p>Contenido protegido</p>
            </RutaProtegida>
          }
        />
        <Route path="/login" element={<p>Pantalla de login</p>} />
        <Route path="/" element={<p>Pantalla de inicio</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("RutaProtegida", () => {
  it("lleva al login si no hay sesión", () => {
    // Arrange
    useAuth.mockReturnValue({ usuario: null });

    // Act
    renderizar("admin");

    // Assert
    expect(screen.getByText("Pantalla de login")).toBeInTheDocument();
  });

  it("lleva al inicio si el rol no corresponde", () => {
    // Arrange
    useAuth.mockReturnValue({ usuario: { rol: "cliente" } });

    // Act
    renderizar("admin");

    // Assert
    expect(screen.getByText("Pantalla de inicio")).toBeInTheDocument();
    expect(screen.queryByText("Contenido protegido")).not.toBeInTheDocument();
  });

  it("muestra el contenido si el rol coincide", () => {
    // Arrange
    useAuth.mockReturnValue({ usuario: { rol: "admin" } });

    // Act
    renderizar("admin");

    // Assert
    expect(screen.getByText("Contenido protegido")).toBeInTheDocument();
  });

  it("sin rol requerido basta con tener sesión", () => {
    // Arrange
    useAuth.mockReturnValue({ usuario: { rol: "cliente" } });

    // Act
    renderizar(undefined);

    // Assert
    expect(screen.getByText("Contenido protegido")).toBeInTheDocument();
  });
});
