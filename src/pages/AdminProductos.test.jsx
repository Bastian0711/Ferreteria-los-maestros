import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AdminProductos from "./AdminProductos";
import { CatalogoProvider } from "../context/CatalogoContext";
import { AuthProvider } from "../context/AuthContext";
import { reiniciarBase } from "../data/baseDatos";
import { obtenerProducto } from "../services/productosService";

function renderizar() {
  return render(
    <AuthProvider>
      <CatalogoProvider>
        <MemoryRouter initialEntries={["/admin/productos"]}>
          <AdminProductos />
        </MemoryRouter>
      </CatalogoProvider>
    </AuthProvider>
  );
}

describe("AdminProductos", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  it("muestra la tabla con los productos y fija el título", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByRole("heading", { name: "Productos" })).toBeInTheDocument();
    expect(screen.getByText("MC001")).toBeInTheDocument();
    expect(document.title).toBe("Administrar productos | Ferretería Los Maestros");
  });

  it("crea un producto nuevo y lo guarda en la base", async () => {
    // Arrange
    renderizar();
    await userEvent.click(screen.getByRole("button", { name: "Nuevo producto" }));
    const dialogo = screen.getByRole("dialog");

    // Act
    await userEvent.type(within(dialogo).getByLabelText("Código"), "zz900");
    await userEvent.type(within(dialogo).getByLabelText("Nombre"), "Producto de prueba");
    await userEvent.selectOptions(within(dialogo).getByLabelText("Categoría"), "madera");
    await userEvent.type(within(dialogo).getByLabelText("Precio de venta"), "1990");
    await userEvent.type(within(dialogo).getByLabelText("Stock"), "10");
    await userEvent.type(within(dialogo).getByLabelText("Stock mínimo"), "2");
    await userEvent.click(within(dialogo).getByRole("button", { name: "Crear producto" }));

    // Assert
    expect(obtenerProducto("ZZ900")).toBeDefined();
    expect(screen.getByText('Producto "Producto de prueba" creado.')).toBeInTheDocument();
    expect(screen.getByText("ZZ900")).toBeInTheDocument();
  });

  it("muestra el error del servicio si el código ya existe", async () => {
    // Arrange
    renderizar();
    await userEvent.click(screen.getByRole("button", { name: "Nuevo producto" }));
    const dialogo = screen.getByRole("dialog");

    // Act
    await userEvent.type(within(dialogo).getByLabelText("Código"), "MC001");
    await userEvent.type(within(dialogo).getByLabelText("Nombre"), "Repetido");
    await userEvent.selectOptions(within(dialogo).getByLabelText("Categoría"), "madera");
    await userEvent.type(within(dialogo).getByLabelText("Precio de venta"), "1000");
    await userEvent.type(within(dialogo).getByLabelText("Stock"), "1");
    await userEvent.type(within(dialogo).getByLabelText("Stock mínimo"), "1");
    await userEvent.click(within(dialogo).getByRole("button", { name: "Crear producto" }));

    // Assert
    expect(screen.getByText("Ya existe un producto con el código MC001.")).toBeInTheDocument();
  });

  it("edita un producto existente", async () => {
    // Arrange
    renderizar();
    const fila = screen.getByText("MC001").closest("tr");
    await userEvent.click(within(fila).getByRole("button", { name: "Editar" }));
    const dialogo = screen.getByRole("dialog");

    // Act
    await userEvent.clear(within(dialogo).getByLabelText("Stock"));
    await userEvent.type(within(dialogo).getByLabelText("Stock"), "33");
    await userEvent.click(within(dialogo).getByRole("button", { name: "Guardar cambios" }));

    // Assert
    expect(obtenerProducto("MC001").stock).toBe(33);
    expect(screen.getByText(/actualizado\./)).toBeInTheDocument();
  });

  it("pide confirmación y elimina el producto", async () => {
    // Arrange
    renderizar();
    const fila = screen.getByText("MC001").closest("tr");
    await userEvent.click(within(fila).getByRole("button", { name: "Eliminar" }));
    const dialogo = screen.getByRole("dialog");

    // Act
    await userEvent.click(within(dialogo).getByRole("button", { name: "Eliminar" }));

    // Assert
    expect(obtenerProducto("MC001")).toBeUndefined();
    expect(screen.queryByText("MC001")).not.toBeInTheDocument();
    expect(screen.getByText(/eliminado\./)).toBeInTheDocument();
  });

  it("no elimina nada si se cancela la confirmación", async () => {
    // Arrange
    renderizar();
    const fila = screen.getByText("MC001").closest("tr");
    await userEvent.click(within(fila).getByRole("button", { name: "Eliminar" }));
    const dialogo = screen.getByRole("dialog");

    // Act
    await userEvent.click(within(dialogo).getByRole("button", { name: "Cancelar" }));

    // Assert
    expect(obtenerProducto("MC001")).toBeDefined();
  });
});
