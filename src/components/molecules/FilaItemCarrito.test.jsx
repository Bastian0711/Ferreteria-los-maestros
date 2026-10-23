import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import FilaItemCarrito from "./FilaItemCarrito";

const ITEM = {
  codigo: "MC002",
  nombre: "Cemento Melón blanco 25 kg",
  unidad: "Saco",
  stock: 40,
  cantidad: 2,
  precioUnitario: 7490,
  subtotal: 14980,
};

function renderizar(item = ITEM) {
  const props = { onCambiarCantidad: vi.fn(), onQuitar: vi.fn() };
  render(<FilaItemCarrito item={item} {...props} />);
  return props;
}

describe("FilaItemCarrito", () => {
  it("muestra el nombre, el precio unitario y el subtotal", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByText("Cemento Melón blanco 25 kg")).toBeInTheDocument();
    expect(screen.getByText("$7.490")).toBeInTheDocument();
    expect(screen.getByText("$14.980")).toBeInTheDocument();
  });

  it("muestra la cantidad actual en el contador", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByDisplayValue("2")).toBeInTheDocument();
  });

  it("llama a onCambiarCantidad con el código y la cantidad aumentada", async () => {
    // Arrange
    const props = renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "+" }));

    // Assert
    expect(props.onCambiarCantidad).toHaveBeenCalledWith("MC002", 3);
  });

  it("llama a onCambiarCantidad con la cantidad reducida", async () => {
    // Arrange
    const props = renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "−" }));

    // Assert
    expect(props.onCambiarCantidad).toHaveBeenCalledWith("MC002", 1);
  });

  it("llama a onQuitar con el código al pulsar Quitar", async () => {
    // Arrange
    const props = renderizar();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Quitar" }));

    // Assert
    expect(props.onQuitar).toHaveBeenCalledWith("MC002");
  });

  it("avisa cuando la cantidad supera el stock disponible", () => {
    // Arrange
    const sinStockSuficiente = { ...ITEM, cantidad: 5, stock: 3 };

    // Act
    renderizar(sinStockSuficiente);

    // Assert
    expect(screen.getByRole("alert")).toHaveTextContent("Stock disponible: 3");
  });

  it("no muestra aviso cuando la cantidad está dentro del stock", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
