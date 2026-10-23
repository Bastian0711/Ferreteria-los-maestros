import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MenuAdmin from "./MenuAdmin";

const opciones = [
  { ruta: "/admin/productos", texto: "Productos" },
  { ruta: "/", texto: "Ver tienda" },
];

describe("MenuAdmin", () => {
  it("muestra las opciones y marca la de la ruta actual", () => {
    // Arrange + Act
    render(<MenuAdmin opciones={opciones} rutaActual="/admin/productos" onNavegar={() => {}} />);

    // Assert
    expect(screen.getByText("Productos")).toHaveClass("active");
    expect(screen.getByText("Ver tienda")).not.toHaveClass("active");
  });

  it("avisa la ruta elegida al hacer clic", async () => {
    // Arrange
    const onNavegar = vi.fn();
    render(<MenuAdmin opciones={opciones} rutaActual="/admin/productos" onNavegar={onNavegar} />);

    // Act
    await userEvent.click(screen.getByText("Ver tienda"));

    // Assert
    expect(onNavegar).toHaveBeenCalledWith("/");
  });
});
