import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormularioProducto from "./FormularioProducto";

const categorias = [
  { id: "pinturas", nombre: "Pinturas" },
  { id: "madera", nombre: "Madera" },
];

function renderizar(props) {
  return render(
    <FormularioProducto categorias={categorias} onGuardar={() => {}} onCancelar={() => {}} {...props} />
  );
}

async function completarBasico() {
  await userEvent.type(screen.getByLabelText("Código"), "nv001");
  await userEvent.type(screen.getByLabelText("Nombre"), "Producto nuevo");
  await userEvent.selectOptions(screen.getByLabelText("Categoría"), "madera");
  await userEvent.type(screen.getByLabelText("Precio de venta"), "1500");
  await userEvent.type(screen.getByLabelText("Stock"), "20");
  await userEvent.type(screen.getByLabelText("Stock mínimo"), "5");
}

describe("FormularioProducto", () => {
  it("muestra los errores si se envía vacío y no guarda", async () => {
    // Arrange
    const onGuardar = vi.fn();
    renderizar({ onGuardar });

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Crear producto" }));

    // Assert
    expect(screen.getByText("El código es obligatorio.")).toBeInTheDocument();
    expect(screen.getByText("El nombre es obligatorio.")).toBeInTheDocument();
    expect(screen.getByText("Selecciona una categoría.")).toBeInTheDocument();
    expect(onGuardar).not.toHaveBeenCalled();
  });

  it("entrega los datos como números al guardar un producto nuevo", async () => {
    // Arrange
    const onGuardar = vi.fn();
    renderizar({ onGuardar });
    await completarBasico();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Crear producto" }));

    // Assert
    expect(onGuardar).toHaveBeenCalledTimes(1);
    expect(onGuardar).toHaveBeenCalledWith(
      expect.objectContaining({
        codigo: "nv001",
        nombre: "Producto nuevo",
        categoriaId: "madera",
        precioVenta: 1500,
        stock: 20,
        stockMinimo: 5,
        oferta: false,
        precioOferta: null,
      })
    );
  });

  it("exige un precio de oferta menor al de venta cuando está en oferta", async () => {
    // Arrange
    const onGuardar = vi.fn();
    renderizar({ onGuardar });
    await completarBasico();

    // Act
    await userEvent.click(screen.getByLabelText("Producto en oferta"));
    await userEvent.type(screen.getByLabelText("Precio de oferta"), "2000");
    await userEvent.click(screen.getByRole("button", { name: "Crear producto" }));

    // Assert
    expect(
      screen.getByText("El precio de oferta debe ser mayor que 0 y menor que el precio de venta.")
    ).toBeInTheDocument();
    expect(onGuardar).not.toHaveBeenCalled();
  });

  it("rechaza un stock negativo", async () => {
    // Arrange
    renderizar();
    await completarBasico();

    // Act
    await userEvent.clear(screen.getByLabelText("Stock"));
    await userEvent.type(screen.getByLabelText("Stock"), "-3");
    await userEvent.click(screen.getByRole("button", { name: "Crear producto" }));

    // Assert
    expect(screen.getByText("El stock debe ser un número entero de 0 o más.")).toBeInTheDocument();
  });

  it("al editar precarga los datos y no permite cambiar el código", () => {
    // Arrange
    const inicial = {
      codigo: "MC001", nombre: "Cemento", categoriaId: "madera", marca: "Melón", unidad: "Saco",
      precioVenta: 6000, stock: 80, stockMinimo: 10, oferta: false, precioOferta: null, destacado: true,
    };

    // Act
    renderizar({ productoInicial: inicial });

    // Assert
    expect(screen.getByText("MC001")).toBeInTheDocument();
    expect(screen.queryByLabelText("Código")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toHaveValue("Cemento");
    expect(screen.getByLabelText("Producto destacado")).toBeChecked();
    expect(screen.getByRole("button", { name: "Guardar cambios" })).toBeInTheDocument();
  });

  it("muestra el error general que llega por props y llama a onCancelar", async () => {
    // Arrange
    const onCancelar = vi.fn();
    renderizar({ error: "Ya existe un producto con el código NV001.", onCancelar });

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    // Assert
    expect(screen.getByText("Ya existe un producto con el código NV001.")).toBeInTheDocument();
    expect(onCancelar).toHaveBeenCalledTimes(1);
  });
});
