import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SeccionProductos from "./SeccionProductos";

const productos = [
  { codigo: "A1", nombre: "Martillo", stock: 10, stockMinimo: 2, precioVenta: 5000, oferta: false },
];

describe("SeccionProductos", () => {
  it("muestra el título y los productos", () => {
    // Arrange + Act
    render(<SeccionProductos titulo="Ofertas" productos={productos} onAgregar={() => {}} />);

    // Assert
    expect(screen.getByRole("heading", { name: "Ofertas" })).toBeInTheDocument();
    expect(screen.getByText("Martillo")).toBeInTheDocument();
  });

  it("no muestra nada si no hay productos", () => {
    // Arrange + Act
    const { container } = render(<SeccionProductos titulo="Ofertas" productos={[]} />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it("muestra el botón de ver todo solo si se entrega onVerTodos", async () => {
    // Arrange
    const onVerTodos = vi.fn();
    const { rerender } = render(
      <SeccionProductos titulo="Ofertas" productos={productos} onAgregar={() => {}} />
    );
    const antes = screen.queryByRole("button", { name: "Ver todo el catálogo" });
    rerender(
      <SeccionProductos titulo="Ofertas" productos={productos} onAgregar={() => {}} onVerTodos={onVerTodos} />
    );

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Ver todo el catálogo" }));

    // Assert
    expect(antes).not.toBeInTheDocument();
    expect(onVerTodos).toHaveBeenCalledTimes(1);
  });
});
