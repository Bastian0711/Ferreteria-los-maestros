import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import { CatalogoProvider } from "../context/CatalogoContext";
import { reiniciarBase } from "../data/baseDatos";
import { crearPedido } from "../services/pedidosService";

function renderizar() {
  return render(
    <CatalogoProvider>
      <MemoryRouter initialEntries={["/admin"]}>
        <AdminDashboard />
      </MemoryRouter>
    </CatalogoProvider>
  );
}

// Busca una tarjeta de estadística por su título.
function tarjeta(titulo) {
  return within(screen.getByText(titulo).closest(".card"));
}

describe("AdminDashboard", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  it("muestra los totales de la semilla y el título", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(document.title).toBe("Resumen | Ferretería Los Maestros");
    expect(tarjeta("Total de productos").getByText("85")).toBeInTheDocument();
    expect(tarjeta("Stock crítico").getByText("6")).toBeInTheDocument();
    expect(tarjeta("Pedidos pendientes").getByText("0")).toBeInTheDocument();
  });

  it("lista los productos con stock crítico", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByText("HE004")).toBeInTheDocument();
    expect(screen.getByText("Sin stock")).toBeInTheDocument();
  });

  it("avisa que aún no hay pedidos", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByText("Aún no hay pedidos.")).toBeInTheDocument();
  });

  it("cuenta los pedidos pendientes y suma las ventas", () => {
    // Arrange
    crearPedido({
      usuario: null,
      items: [{ codigo: "MC002", cantidad: 2 }],
      entrega: { tipo: "retiro" },
      datosCliente: {},
    });

    // Act
    renderizar();

    // Assert
    expect(screen.getByText("FM-00001")).toBeInTheDocument();
    expect(tarjeta("Pedidos pendientes").getByText("1")).toBeInTheDocument();
    expect(tarjeta("Ventas registradas").getByText(/14\.980/)).toBeInTheDocument();
  });
});
