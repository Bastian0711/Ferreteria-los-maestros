import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ListaCarrito from "./ListaCarrito";

const ITEMS = [
  {
    codigo: "MC002", nombre: "Cemento Melón blanco 25 kg", unidad: "Saco",
    stock: 40, cantidad: 2, precioUnitario: 7490, subtotal: 14980,
  },
  {
    codigo: "MC001", nombre: "Cemento Polpaico gris 25 kg", unidad: "Saco",
    stock: 80, cantidad: 1, precioUnitario: 5090, subtotal: 5090,
  },
];

function renderizar(items = ITEMS) {
  const props = {
    onCambiarCantidad: vi.fn(),
    onQuitar: vi.fn(),
    onLimpiar: vi.fn(),
    onConfirmar: vi.fn(),
  };
  render(<ListaCarrito items={items} total={20070} cantidadTotal={3} {...props} />);
  return props;
}

describe("ListaCarrito", () => {
  it("muestra una fila por cada producto", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByText("Cemento Melón blanco 25 kg")).toBeInTheDocument();
    expect(screen.getByText("Cemento Polpaico gris 25 kg")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Quitar" })).toHaveLength(2);
  });

  it("muestra la cantidad de productos y el total", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("$20.070")).toBeInTheDocument();
  });

  it("llama a onQuitar con el código de la fila elegida", async () => {
    // Arrange
    const props = renderizar();

    // Act
    await userEvent.click(screen.getAllByRole("button", { name: "Quitar" })[1]);

    // Assert
    expect(props.onQuitar).toHaveBeenCalledWith("MC001");
  });

  it("llama a onCambiarCantidad al usar el contador de una fila", async () => {
    // Arrange
    const props = renderizar();

    // Act
    await userEvent.click(screen.getAllByRole("button", { name: "+" })[0]);

    // Assert
    expect(props.onCambiarCantidad).toHaveBeenCalledWith("MC002", 3);
  });

  it("llama a onLimpiar al pulsar Limpiar solicitud", async () => {
    // Arrange
    const props = renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Limpiar solicitud" }));

    // Assert
    expect(props.onLimpiar).toHaveBeenCalledTimes(1);
  });

  it("llama a onConfirmar al pulsar Confirmar solicitud", async () => {
    // Arrange
    const props = renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Confirmar solicitud" }));

    // Assert
    expect(props.onConfirmar).toHaveBeenCalledTimes(1);
  });

  it("no deja confirmar si alguna cantidad supera el stock", () => {
    // Arrange
    const conProblema = [{ ...ITEMS[0], cantidad: 50, stock: 40 }];

    // Act
    renderizar(conProblema);

    // Assert
    expect(screen.getByRole("button", { name: "Confirmar solicitud" })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent("Ajusta las cantidades");
  });
});
