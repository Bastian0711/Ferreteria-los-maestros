import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import FichaProducto from "./FichaProducto";

const PRODUCTO = {
  codigo: "MC001",
  nombre: "Cemento Polpaico gris 25 kg",
  marca: "Polpaico",
  unidad: "Saco",
  subcategoria: "Cementos",
  stock: 20,
  stockMinimo: 5,
  precioVenta: 5990,
  oferta: false,
  precioOferta: null,
  imagen: "",
};

function renderizar(producto = PRODUCTO) {
  const props = { onAgregar: vi.fn(), onVolver: vi.fn() };
  render(<FichaProducto producto={producto} categoriaNombre="Materiales de Construcción" {...props} />);
  return props;
}

describe("FichaProducto", () => {
  it("muestra los datos del producto", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByRole("heading", { name: "Cemento Polpaico gris 25 kg" })).toBeInTheDocument();
    expect(screen.getByText("Polpaico")).toBeInTheDocument();
    expect(screen.getByText("Materiales de Construcción")).toBeInTheDocument();
    expect(screen.getByText("Se vende por: Saco")).toBeInTheDocument();
    expect(screen.getByText(/5\.990/)).toBeInTheDocument();
  });

  it("muestra el precio de oferta con el original tachado", () => {
    // Arrange
    const enOferta = { ...PRODUCTO, oferta: true, precioOferta: 5090 };

    // Act
    renderizar(enOferta);

    // Assert
    expect(screen.getByText(/5\.090/)).toBeInTheDocument();
    expect(screen.getByText(/5\.990/)).toBeInTheDocument();
    expect(screen.getByText("Oferta")).toBeInTheDocument();
  });

  it("agrega una unidad por defecto", async () => {
    // Arrange
    const props = renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Agregar a la solicitud" }));

    // Assert
    expect(props.onAgregar).toHaveBeenCalledWith(1);
  });

  it("agrega la cantidad elegida con el contador", async () => {
    // Arrange
    const props = renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "+" }));
    await userEvent.click(screen.getByRole("button", { name: "+" }));
    await userEvent.click(screen.getByRole("button", { name: "Agregar a la solicitud" }));

    // Assert
    expect(props.onAgregar).toHaveBeenCalledWith(3);
  });

  it("no deja elegir más unidades que el stock", async () => {
    // Arrange
    renderizar({ ...PRODUCTO, stock: 2 });

    // Act
    await userEvent.click(screen.getByRole("button", { name: "+" }));

    // Assert
    expect(screen.getByRole("button", { name: "+" })).toBeDisabled();
    expect(screen.getByDisplayValue("2")).toBeInTheDocument();
  });

  it("deshabilita el botón de agregar cuando no hay stock", () => {
    // Arrange + Act
    renderizar({ ...PRODUCTO, stock: 0 });

    // Assert
    expect(screen.getByRole("button", { name: "Agregar a la solicitud" })).toBeDisabled();
    expect(screen.getByText("Sin stock")).toBeInTheDocument();
  });

  it("llama a onVolver al pulsar Volver al catálogo", async () => {
    // Arrange
    const props = renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Volver al catálogo" }));

    // Assert
    expect(props.onVolver).toHaveBeenCalledTimes(1);
  });
});
