import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Carrito from "./Carrito";
import { CatalogoProvider } from "../context/CatalogoContext";
import { CarritoProvider } from "../context/CarritoContext";
import { reiniciarBase } from "../data/baseDatos";

// MC002 (Cemento Melón blanco 25 kg) cuesta $7.490 y tiene stock 40 en la semilla.
function guardarCarrito(lineas) {
  localStorage.setItem("ferreteria_carrito", JSON.stringify(lineas));
}

function renderizar() {
  return render(
    <CatalogoProvider>
      <CarritoProvider>
        <MemoryRouter initialEntries={["/carrito"]}>
          <Routes>
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/catalogo" element={<p>Pantalla de catálogo</p>} />
            <Route path="/checkout" element={<p>Pantalla de checkout</p>} />
          </Routes>
        </MemoryRouter>
      </CarritoProvider>
    </CatalogoProvider>
  );
}

describe("Carrito", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  it("muestra el mensaje de solicitud vacía cuando no hay productos", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByText("Tu solicitud está vacía.")).toBeInTheDocument();
    expect(document.title).toBe("Solicitud en curso | Ferretería Los Maestros");
  });

  it("lleva al catálogo desde el mensaje de solicitud vacía", async () => {
    // Arrange
    renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Ir al catálogo" }));

    // Assert
    expect(screen.getByText("Pantalla de catálogo")).toBeInTheDocument();
  });

  it("muestra los productos guardados con su subtotal y el total", () => {
    // Arrange
    guardarCarrito([{ codigo: "MC002", cantidad: 2 }]);

    // Act
    renderizar();

    // Assert
    expect(screen.getByText("Cemento Melón blanco 25 kg")).toBeInTheDocument();
    expect(screen.getAllByText("$14.980")).toHaveLength(2); // subtotal de la fila y total
  });

  it("actualiza el total al cambiar la cantidad", async () => {
    // Arrange
    guardarCarrito([{ codigo: "MC002", cantidad: 2 }]);
    renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "+" }));

    // Assert
    expect(screen.getAllByText("$22.470")).toHaveLength(2);
  });

  it("quita un producto y vuelve al mensaje de solicitud vacía", async () => {
    // Arrange
    guardarCarrito([{ codigo: "MC002", cantidad: 1 }]);
    renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Quitar" }));

    // Assert
    expect(screen.getByText("Tu solicitud está vacía.")).toBeInTheDocument();
  });

  it("limpia toda la solicitud", async () => {
    // Arrange
    guardarCarrito([{ codigo: "MC002", cantidad: 1 }, { codigo: "MC001", cantidad: 1 }]);
    renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Limpiar solicitud" }));

    // Assert
    expect(screen.getByText("Tu solicitud está vacía.")).toBeInTheDocument();
  });

  it("lleva al checkout al confirmar la solicitud", async () => {
    // Arrange
    guardarCarrito([{ codigo: "MC002", cantidad: 1 }]);
    renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Confirmar solicitud" }));

    // Assert
    expect(screen.getByText("Pantalla de checkout")).toBeInTheDocument();
  });

  it("muestra la cantidad de unidades en la insignia de la barra", () => {
    // Arrange
    guardarCarrito([{ codigo: "MC002", cantidad: 2 }]);

    // Act
    renderizar();

    // Assert
    expect(screen.getByLabelText("2 productos en el carrito")).toBeInTheDocument();
  });
});
