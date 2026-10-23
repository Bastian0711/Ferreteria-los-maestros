import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilaProductoAdmin from "./FilaProductoAdmin";

const producto = {
  codigo: "ZZ001",
  nombre: "Martillo de prueba",
  categoriaId: "herramientas-manuales",
  precioVenta: 10000,
  oferta: false,
  precioOferta: null,
  stock: 5,
  stockMinimo: 10,
};

function renderizarFila(props) {
  return render(
    <table>
      <tbody>
        <FilaProductoAdmin
          producto={producto}
          categoriaNombre="Herramientas manuales"
          onEditar={() => {}}
          onEliminar={() => {}}
          {...props}
        />
      </tbody>
    </table>
  );
}

describe("FilaProductoAdmin", () => {
  it("muestra código, nombre, categoría y stock bajo", () => {
    // Arrange + Act
    renderizarFila();

    // Assert
    expect(screen.getByText("ZZ001")).toBeInTheDocument();
    expect(screen.getByText("Martillo de prueba")).toBeInTheDocument();
    expect(screen.getByText("Herramientas manuales")).toBeInTheDocument();
    expect(screen.getByText("¡Solo quedan 5 productos!")).toBeInTheDocument();
  });

  it("marca el producto como oferta cuando corresponde", () => {
    // Arrange + Act
    renderizarFila({ producto: { ...producto, oferta: true, precioOferta: 8000 } });

    // Assert
    expect(screen.getByText("Oferta")).toBeInTheDocument();
  });

  it("entrega el código al pulsar Editar y Eliminar", async () => {
    // Arrange
    const onEditar = vi.fn();
    const onEliminar = vi.fn();
    renderizarFila({ onEditar, onEliminar });

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Editar" }));
    await userEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    // Assert
    expect(onEditar).toHaveBeenCalledWith("ZZ001");
    expect(onEliminar).toHaveBeenCalledWith("ZZ001");
  });
});
