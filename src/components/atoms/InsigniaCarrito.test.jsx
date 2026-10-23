import { render, screen } from "@testing-library/react";
import InsigniaCarrito from "./InsigniaCarrito";

describe("InsigniaCarrito", () => {
  it("muestra la cantidad de productos", () => {
    // Arrange + Act
    render(<InsigniaCarrito cantidad={3} />);

    // Assert
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("describe la cantidad para lectores de pantalla", () => {
    // Arrange + Act
    render(<InsigniaCarrito cantidad={3} />);

    // Assert
    expect(screen.getByLabelText("3 productos en el carrito")).toBeInTheDocument();
  });

  it("no se muestra cuando la cantidad es cero", () => {
    // Arrange + Act
    const { container } = render(<InsigniaCarrito cantidad={0} />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it("no se muestra cuando no recibe cantidad", () => {
    // Arrange + Act
    const { container } = render(<InsigniaCarrito />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });
});
