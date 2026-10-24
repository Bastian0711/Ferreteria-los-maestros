import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormularioProducto from "./FormularioProducto";

const categorias = [{ id: "madera", nombre: "Madera" }];

describe("FormularioProducto - imagen", () => {
  it("entrega la ruta de la imagen al guardar", async () => {
    // Arrange
    const onGuardar = vi.fn();
    render(<FormularioProducto categorias={categorias} onGuardar={onGuardar} onCancelar={() => {}} />);
    await userEvent.type(screen.getByLabelText("Código"), "nv001");
    await userEvent.type(screen.getByLabelText("Nombre"), "Producto nuevo");
    await userEvent.selectOptions(screen.getByLabelText("Categoría"), "madera");
    await userEvent.type(screen.getByLabelText("Precio de venta"), "1500");
    await userEvent.type(screen.getByLabelText("Stock"), "20");
    await userEvent.type(screen.getByLabelText("Stock mínimo"), "5");
    await userEvent.type(screen.getByLabelText(/Imagen/), "/productos/NV001.jpg");

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Crear producto" }));

    // Assert
    expect(onGuardar).toHaveBeenCalledWith(
      expect.objectContaining({ imagen: "/productos/NV001.jpg" })
    );
  });

  it("al editar precarga la imagen actual del producto", () => {
    // Arrange
    const inicial = {
      codigo: "MC001", nombre: "Cemento", categoriaId: "madera", marca: "Melón", unidad: "Saco",
      precioVenta: 6000, stock: 80, stockMinimo: 10, oferta: false, precioOferta: null,
      destacado: false, imagen: "/productos/MC001.jpg",
    };

    // Act
    render(<FormularioProducto categorias={categorias} productoInicial={inicial} onGuardar={() => {}} onCancelar={() => {}} />);

    // Assert
    expect(screen.getByLabelText(/Imagen/)).toHaveValue("/productos/MC001.jpg");
  });
});
