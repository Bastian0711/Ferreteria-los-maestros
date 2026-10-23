import { act, render, screen } from "@testing-library/react";
import { CatalogoProvider, useCatalogo } from "./CatalogoContext";
import { reiniciarBase } from "../data/baseDatos";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
} from "../services/productosService";
import { crearPedido } from "../services/pedidosService";

// Componente de apoyo: muestra cuántos productos hay y el stock de MC001.
function Listado() {
  const { productos, categorias } = useCatalogo();
  const cemento = productos.find((p) => p.codigo === "MC001");

  return (
    <div>
      <p data-testid="productos">{productos.length}</p>
      <p data-testid="categorias">{categorias.length}</p>
      <p data-testid="stock">{cemento ? cemento.stock : "no existe"}</p>
    </div>
  );
}

function renderizar() {
  return render(
    <CatalogoProvider>
      <Listado />
    </CatalogoProvider>
  );
}

describe("CatalogoContext", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  it("entrega los 85 productos y las 10 categorías", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByTestId("productos").textContent).toBe("85");
    expect(screen.getByTestId("categorias").textContent).toBe("10");
  });

  it("se actualiza cuando cambia el stock de un producto", () => {
    // Arrange
    renderizar();

    // Act
    act(() => {
      actualizarProducto("MC001", { stock: 3 });
    });

    // Assert
    expect(screen.getByTestId("stock").textContent).toBe("3");
  });

  it("se actualiza cuando se crea un producto", () => {
    // Arrange
    renderizar();

    // Act
    act(() => {
      crearProducto({ codigo: "ZZ001", nombre: "Nuevo", precioVenta: 1000, stock: 5 });
    });

    // Assert
    expect(screen.getByTestId("productos").textContent).toBe("86");
  });

  it("se actualiza cuando se elimina un producto", () => {
    // Arrange
    renderizar();

    // Act
    act(() => {
      eliminarProducto("MC001");
    });

    // Assert
    expect(screen.getByTestId("productos").textContent).toBe("84");
    expect(screen.getByTestId("stock").textContent).toBe("no existe");
  });

  it("se actualiza cuando una compra descuenta stock", () => {
    // Arrange
    renderizar();
    const stockAntes = Number(screen.getByTestId("stock").textContent);

    // Act
    act(() => {
      crearPedido({
        items: [{ codigo: "MC001", cantidad: 2 }],
        entrega: { tipo: "retiro" },
        datosCliente: { nombre: "Camila" },
      });
    });

    // Assert
    expect(screen.getByTestId("stock").textContent).toBe(String(stockAntes - 2));
  });

  it("useCatalogo funciona sin provider y entrega un catálogo vacío", () => {
    // Arrange + Act
    render(<Listado />);

    // Assert
    expect(screen.getByTestId("productos").textContent).toBe("0");
  });
});
