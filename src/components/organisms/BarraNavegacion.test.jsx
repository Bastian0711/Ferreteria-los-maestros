import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BarraNavegacion from "./BarraNavegacion";

function renderizar(props) {
  return render(<BarraNavegacion onNavegar={() => {}} {...props} />);
}

describe("BarraNavegacion", () => {
  it("sin sesión ofrece iniciar sesión y registro", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();
    expect(screen.getByText("Registro")).toBeInTheDocument();
    expect(screen.queryByText("Cerrar sesión")).not.toBeInTheDocument();
    expect(screen.queryByText("Panel admin")).not.toBeInTheDocument();
  });

  it("con un cliente muestra cerrar sesión pero no el panel", () => {
    // Arrange + Act
    renderizar({ usuario: { rol: "cliente" } });

    // Assert
    expect(screen.getByText("Cerrar sesión")).toBeInTheDocument();
    expect(screen.queryByText("Panel admin")).not.toBeInTheDocument();
  });

  it("con un administrador muestra el panel admin", () => {
    // Arrange + Act
    renderizar({ usuario: { rol: "admin" } });

    // Assert
    expect(screen.getByText("Panel admin")).toBeInTheDocument();
  });

  it("muestra la cantidad del carrito", () => {
    // Arrange + Act
    renderizar({ cantidadCarrito: 3 });

    // Assert
    expect(screen.getByLabelText("3 productos en el carrito")).toBeInTheDocument();
  });

  it("navega a la ruta del enlace pulsado", async () => {
    // Arrange
    const onNavegar = vi.fn();
    renderizar({ onNavegar });

    // Act
    await userEvent.click(screen.getByText("Catálogo"));

    // Assert
    expect(onNavegar).toHaveBeenCalledWith("/catalogo");
  });

  it("al cerrar sesión avisa y vuelve al inicio", async () => {
    // Arrange
    const onNavegar = vi.fn();
    const onCerrarSesion = vi.fn();
    renderizar({ usuario: { rol: "cliente" }, onNavegar, onCerrarSesion });

    // Act
    await userEvent.click(screen.getByText("Cerrar sesión"));

    // Assert
    expect(onCerrarSesion).toHaveBeenCalledTimes(1);
    expect(onNavegar).toHaveBeenCalledWith("/");
  });
});
