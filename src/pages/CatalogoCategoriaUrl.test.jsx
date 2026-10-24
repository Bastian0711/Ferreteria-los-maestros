import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Catalogo from "./Catalogo";
import { CatalogoProvider } from "../context/CatalogoContext";
import { CarritoProvider } from "../context/CarritoContext";
import { reiniciarBase } from "../data/baseDatos";

function renderizar(ruta) {
  return render(
    <CatalogoProvider>
      <CarritoProvider>
        <MemoryRouter initialEntries={[ruta]}>
          <Catalogo />
        </MemoryRouter>
      </CarritoProvider>
    </CatalogoProvider>
  );
}

describe("Catalogo - categoría en la dirección", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  it("parte filtrado por la categoría indicada en la dirección", () => {
    // Arrange + Act
    renderizar("/catalogo?categoria=gasfiteria");

    // Assert
    expect(screen.getByLabelText("Categoría")).toHaveValue("gasfiteria");
    expect(screen.queryByText("Cemento Melón blanco 25 kg")).not.toBeInTheDocument();
  });

  it("muestra todo el catálogo si no se indica categoría", () => {
    // Arrange + Act
    renderizar("/catalogo");

    // Assert
    expect(screen.getByLabelText("Categoría")).toHaveValue("");
    expect(screen.getByText("Cemento Melón blanco 25 kg")).toBeInTheDocument();
  });
});
