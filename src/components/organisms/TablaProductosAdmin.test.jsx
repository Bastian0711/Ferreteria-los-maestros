import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TablaProductosAdmin from "./TablaProductosAdmin";

const categorias = [{ id: "pinturas", nombre: "Pinturas" }];
const productos = [
  { codigo: "A1", nombre: "Pintura blanca", marca: "Sherwin", categoriaId: "pinturas",
    precioVenta: 5000, oferta: false, stock: 50, stockMinimo: 10 },
  { codigo: "A2", nombre: "Rodillo", marca: "Tricolor", categoriaId: "pinturas",
    precioVenta: 3000, oferta: false, stock: 2, stockMinimo: 10 },
];

function renderizarTabla(props) {
  return render(
    <TablaProductosAdmin
      productos={productos}
      categorias={categorias}
      onEditar={() => {}}
      onEliminar={() => {}}
      {...props}
    />
  );
}

describe("TablaProductosAdmin", () => {
  it("lista todos los productos con el nombre de su categoría", () => {
    // Arrange + Act
    renderizarTabla();

    // Assert
    expect(screen.getByText("Pintura blanca")).toBeInTheDocument();
    expect(screen.getByText("Rodillo")).toBeInTheDocument();
    expect(screen.getAllByText("Pinturas")).toHaveLength(2);
    expect(screen.getByText("2 productos")).toBeInTheDocument();
  });

  it("filtra por texto al escribir en el buscador", async () => {
    // Arrange
    renderizarTabla();

    // Act
    await userEvent.type(screen.getByLabelText("Buscar"), "rodillo");

    // Assert
    expect(screen.queryByText("Pintura blanca")).not.toBeInTheDocument();
    expect(screen.getByText("Rodillo")).toBeInTheDocument();
  });

  it("muestra solo los de stock crítico al activar el filtro", async () => {
    // Arrange
    renderizarTabla();

    // Act
    await userEvent.click(screen.getByLabelText("Solo stock crítico"));

    // Assert
    expect(screen.queryByText("Pintura blanca")).not.toBeInTheDocument();
    expect(screen.getByText("Rodillo")).toBeInTheDocument();
    expect(screen.getByText("1 producto")).toBeInTheDocument();
  });

  it("avisa cuando no hay productos que mostrar", () => {
    // Arrange + Act
    renderizarTabla({ productos: [] });

    // Assert
    expect(screen.getByText("No hay productos que mostrar.")).toBeInTheDocument();
  });

  it("pasa el código a onEditar y onEliminar", async () => {
    // Arrange
    const onEditar = vi.fn();
    const onEliminar = vi.fn();
    renderizarTabla({ onEditar, onEliminar });

    // Act
    await userEvent.click(screen.getAllByRole("button", { name: "Editar" })[0]);
    await userEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[1]);

    // Assert
    expect(onEditar).toHaveBeenCalledWith("A1");
    expect(onEliminar).toHaveBeenCalledWith("A2");
  });
});
