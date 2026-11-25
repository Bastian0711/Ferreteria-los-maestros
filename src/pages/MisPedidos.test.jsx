import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import MisPedidos from "./MisPedidos";
import { AuthProvider } from "../context/AuthContext";
import { CatalogoProvider } from "../context/CatalogoContext";
import { CarritoProvider } from "../context/CarritoContext";
import { reiniciarBase } from "../data/baseDatos";
import { crearPedido } from "../services/pedidosService";
import { iniciarSesionDePrueba } from "../test/sesionDePrueba";

const CLIENTE = { id: 3, nombre: "Camila", apellidos: "Soto Reyes", correo: "cliente@maestros.cl", rol: "cliente", cuentaCorriente: false };
const CONTRATISTA = { id: 2, nombre: "Carlos", apellidos: "Maturana", correo: "contratista@maestros.cl", rol: "contratista", cuentaCorriente: true };

function renderizar() {
  return render(
    <AuthProvider>
      <CatalogoProvider>
        <CarritoProvider>
          <MemoryRouter initialEntries={["/mis-pedidos"]}>
            <Routes>
              <Route path="/mis-pedidos" element={<MisPedidos />} />
              <Route path="/pedido/:numero" element={<p>Detalle de la solicitud</p>} />
            </Routes>
          </MemoryRouter>
        </CarritoProvider>
      </CatalogoProvider>
    </AuthProvider>
  );
}

describe("MisPedidos", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  it("muestra solo las solicitudes del cliente con sesión", async () => {
    // Arrange
    iniciarSesionDePrueba(CONTRATISTA);
    await crearPedido({ items: [{ codigo: "MC002", cantidad: 1 }], entrega: { tipo: "retiro" } });
    iniciarSesionDePrueba(CLIENTE);
    const propio = await crearPedido({ items: [{ codigo: "MC002", cantidad: 2 }], entrega: { tipo: "retiro" } });

    // Act
    renderizar();

    // Assert
    expect(await screen.findByText(propio.numero)).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(2); // encabezado + 1 pedido
  });

  it("muestra el saldo de cuenta corriente al contratista", async () => {
    // Arrange
    iniciarSesionDePrueba(CONTRATISTA);
    await crearPedido({ items: [{ codigo: "MC002", cantidad: 1 }], entrega: { tipo: "retiro" } });

    // Act
    renderizar();

    // Assert
    expect(await screen.findByText("Saldo de cuenta corriente")).toBeInTheDocument();
  });

  it("no muestra saldo a un cliente sin cuenta corriente", async () => {
    // Arrange
    iniciarSesionDePrueba(CLIENTE);

    // Act
    renderizar();

    // Assert
    expect(await screen.findByText("Aún no hay pedidos.")).toBeInTheDocument();
    expect(screen.queryByText("Saldo de cuenta corriente")).not.toBeInTheDocument();
  });

  it("lleva al detalle al pulsar Ver", async () => {
    // Arrange
    iniciarSesionDePrueba(CLIENTE);
    await crearPedido({ items: [{ codigo: "MC002", cantidad: 1 }], entrega: { tipo: "retiro" } });
    renderizar();

    // Act
    await userEvent.click(await screen.findByRole("button", { name: "Ver" }));

    // Assert
    expect(screen.getByText("Detalle de la solicitud")).toBeInTheDocument();
  });
});
