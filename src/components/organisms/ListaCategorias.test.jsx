import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ListaCategorias from "./ListaCategorias";

const categorias = [
  { id: "gasfiteria", nombre: "Gasfitería" },
  { id: "madera", nombre: "Madera y Tableros" },
];

describe("ListaCategorias", () => {
  it("muestra un botón por categoría", () => {
    // Arrange + Act
    render(<ListaCategorias categorias={categorias} onElegir={() => {}} />);

    // Assert
    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Gasfitería" })).toBeInTheDocument();
  });

  it("avisa el id de la categoría elegida", async () => {
    // Arrange
    const onElegir = vi.fn();
    render(<ListaCategorias categorias={categorias} onElegir={onElegir} />);

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Madera y Tableros" }));

    // Assert
    expect(onElegir).toHaveBeenCalledWith("madera");
  });
});
