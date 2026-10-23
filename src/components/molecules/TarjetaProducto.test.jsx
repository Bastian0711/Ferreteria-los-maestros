import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import TarjetaProducto from "./TarjetaProducto";

function renderizar(extra = {}) {
  const props = {
    id: "MC001",
    nombre: "Cemento Polpaico gris 25 kg",
    precio: 5990,
    stock: 20,
    stockMinimo: 5,
    onAgregar: vi.fn(),
    onVerDetalle: vi.fn(),
    ...extra,
  };
  render(<TarjetaProducto {...props} />);
  return props;
}

describe("TarjetaProducto", () => {
  it("muestra el nombre y el precio", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByText("Cemento Polpaico gris 25 kg")).toBeInTheDocument();
    expect(screen.getByText(/5\.990/)).toBeInTheDocument();
  });

  it("llama a onAgregar con el código al pulsar Agregar", async () => {
    // Arrange
    const props = renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Agregar" }));

    // Assert
    expect(props.onAgregar).toHaveBeenCalledTimes(1);
    expect(props.onAgregar).toHaveBeenCalledWith("MC001");
  });

  it("deshabilita el botón Agregar cuando no hay stock", () => {
    // Arrange + Act
    renderizar({ stock: 0 });

    // Assert
    expect(screen.getByRole("button", { name: "Agregar" })).toBeDisabled();
    expect(screen.getByText("Sin stock")).toBeInTheDocument();
  });

  it("llama a onVerDetalle con el código al pulsar el nombre", async () => {
    // Arrange
    const props = renderizar();

    // Act
    await userEvent.click(screen.getByRole("link", { name: "Cemento Polpaico gris 25 kg" }));

    // Assert
    expect(props.onVerDetalle).toHaveBeenCalledWith("MC001");
  });

  it("avisa que quedan pocos cuando el stock llega al mínimo", () => {
    // Arrange + Act
    renderizar({ stock: 3, stockMinimo: 5 });

    // Assert
    expect(screen.getByRole("alert")).toHaveTextContent("Solo quedan 3 productos");
  });

  it("muestra la etiqueta de oferta y el precio original tachado", () => {
    // Arrange + Act
    renderizar({ oferta: true, precio: 5090, precioOriginal: 5990 });

    // Assert
    expect(screen.getByText("Oferta")).toBeInTheDocument();
    expect(screen.getByText(/5\.990/)).toBeInTheDocument();
    expect(screen.getByText(/5\.090/)).toBeInTheDocument();
  });

  it("no muestra etiqueta de oferta cuando no hay oferta", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.queryByText("Oferta")).not.toBeInTheDocument();
  });
});
