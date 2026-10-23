import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import GrillaProductos from "./GrillaProductos";

const PRODUCTOS = [
  {
    codigo: "MC001", nombre: "Cemento Polpaico gris 25 kg", stock: 20, stockMinimo: 5,
    precioVenta: 5990, oferta: true, precioOferta: 5090,
  },
  {
    codigo: "MC002", nombre: "Cemento Melón blanco 25 kg", stock: 40, stockMinimo: 10,
    precioVenta: 7490, oferta: false, precioOferta: null,
  },
];

describe("GrillaProductos", () => {
  it("muestra una tarjeta por cada producto", () => {
    // Arrange + Act
    render(<GrillaProductos productos={PRODUCTOS} onAgregar={vi.fn()} onVerDetalle={vi.fn()} />);

    // Assert
    expect(screen.getAllByRole("button", { name: "Agregar" })).toHaveLength(2);
  });

  it("muestra el precio de oferta en los productos que la tienen", () => {
    // Arrange + Act
    render(<GrillaProductos productos={PRODUCTOS} onAgregar={vi.fn()} onVerDetalle={vi.fn()} />);

    // Assert
    expect(screen.getByText(/5\.090/)).toBeInTheDocument();
    expect(screen.getAllByText("Oferta")).toHaveLength(1);
  });

  it("llama a onAgregar con el código del producto elegido", async () => {
    // Arrange
    const onAgregar = vi.fn();
    render(<GrillaProductos productos={PRODUCTOS} onAgregar={onAgregar} onVerDetalle={vi.fn()} />);

    // Act
    await userEvent.click(screen.getAllByRole("button", { name: "Agregar" })[1]);

    // Assert
    expect(onAgregar).toHaveBeenCalledWith("MC002");
  });

  it("llama a onVerDetalle al pulsar el nombre de un producto", async () => {
    // Arrange
    const onVerDetalle = vi.fn();
    render(<GrillaProductos productos={PRODUCTOS} onAgregar={vi.fn()} onVerDetalle={onVerDetalle} />);

    // Act
    await userEvent.click(screen.getByRole("link", { name: "Cemento Melón blanco 25 kg" }));

    // Assert
    expect(onVerDetalle).toHaveBeenCalledWith("MC002");
  });

  it("muestra un mensaje cuando no hay productos", () => {
    // Arrange + Act
    render(<GrillaProductos productos={[]} onAgregar={vi.fn()} onVerDetalle={vi.fn()} />);

    // Assert
    expect(screen.getByRole("status")).toHaveTextContent("No encontramos productos con esos filtros.");
  });

  it("permite personalizar el mensaje cuando no hay productos", () => {
    // Arrange + Act
    render(<GrillaProductos productos={[]} mensajeVacio="Sin ofertas por ahora." />);

    // Assert
    expect(screen.getByText("Sin ofertas por ahora.")).toBeInTheDocument();
  });
});
