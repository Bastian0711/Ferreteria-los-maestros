import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ResultadoPedido from "./ResultadoPedido";
import { AuthProvider } from "../context/AuthContext";
import { reiniciarBase } from "../data/baseDatos";
import { crearPedido } from "../services/pedidosService";

const DATOS_CLIENTE = { nombre: "Camila", apellidos: "Soto Reyes", correo: "camila@correo.cl" };
const USUARIO_2 = { id: 2, nombre: "Carlos", rol: "cliente", cuentaCorriente: true };
const USUARIO_3 = { id: 3, nombre: "Camila", rol: "cliente", cuentaCorriente: false };
const ADMIN = { id: 1, nombre: "Administrador", rol: "admin", cuentaCorriente: false };

function crear(usuario, entrega = { tipo: "retiro" }) {
  return crearPedido({
    usuario,
    items: [{ codigo: "MC002", cantidad: 2 }],
    entrega,
    datosCliente: DATOS_CLIENTE,
  });
}

function iniciarSesionComo(usuario) {
  localStorage.setItem("ferreteria_sesion", JSON.stringify(usuario));
}

function renderizar(entrada) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[entrada]}>
        <Routes>
          <Route path="/pedido/:numero" element={<ResultadoPedido />} />
          <Route path="/catalogo" element={<p>Pantalla de catálogo</p>} />
          <Route path="/checkout" element={<p>Pantalla de checkout</p>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

describe("ResultadoPedido", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  it("muestra el número, el estado y el total de una solicitud exitosa", () => {
    // Arrange
    const pedido = crear(null);

    // Act
    renderizar(`/pedido/${pedido.numero}`);

    // Assert
    expect(screen.getByRole("heading", { name: "¡Solicitud registrada!" })).toBeInTheDocument();
    expect(screen.getByText("FM-00001")).toBeInTheDocument();
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
    expect(screen.getAllByText("$14.980")).toHaveLength(2);
  });

  it("actualiza el título de la página con el número de solicitud", () => {
    // Arrange
    const pedido = crear(null);

    // Act
    renderizar(`/pedido/${pedido.numero}`);

    // Assert
    expect(document.title).toBe("Solicitud FM-00001 | Ferretería Los Maestros");
  });

  it("muestra el pago pendiente a fin de mes de un cliente con cuenta corriente", () => {
    // Arrange
    const pedido = crear(USUARIO_2);
    iniciarSesionComo(USUARIO_2);

    // Act
    renderizar(`/pedido/${pedido.numero}`);

    // Assert
    expect(screen.getByText("Pago pendiente a fin de mes")).toBeInTheDocument();
  });

  it("muestra la dirección cuando la entrega es por despacho", () => {
    // Arrange
    const pedido = crear(null, { tipo: "despacho", direccion: "Av. Siempre Viva 123" });

    // Act
    renderizar(`/pedido/${pedido.numero}`);

    // Assert
    expect(screen.getByText("Despacho a domicilio: Av. Siempre Viva 123")).toBeInTheDocument();
  });

  it("no deja que un cliente vea la solicitud de otro cliente", () => {
    // Arrange
    const pedido = crear(USUARIO_2);
    iniciarSesionComo(USUARIO_3);

    // Act
    renderizar(`/pedido/${pedido.numero}`);

    // Assert
    expect(screen.getByRole("heading", { name: "Solicitud no encontrada" })).toBeInTheDocument();
  });

  it("no deja ver la solicitud de un cliente registrado sin iniciar sesión", () => {
    // Arrange
    const pedido = crear(USUARIO_2);

    // Act
    renderizar(`/pedido/${pedido.numero}`);

    // Assert
    expect(screen.getByRole("heading", { name: "Solicitud no encontrada" })).toBeInTheDocument();
  });

  it("deja que el administrador vea cualquier solicitud", () => {
    // Arrange
    const pedido = crear(USUARIO_2);
    iniciarSesionComo(ADMIN);

    // Act
    renderizar(`/pedido/${pedido.numero}`);

    // Assert
    expect(screen.getByRole("heading", { name: "¡Solicitud registrada!" })).toBeInTheDocument();
  });

  it("muestra un aviso cuando el número de solicitud no existe", async () => {
    // Arrange
    renderizar("/pedido/FM-99999");

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Ir al catálogo" }));

    // Assert
    expect(screen.getByText("Pantalla de catálogo")).toBeInTheDocument();
  });

  it("muestra el motivo del error recibido desde el checkout", () => {
    // Arrange + Act
    renderizar({ pathname: "/pedido/error", state: { motivo: "Stock insuficiente de Cemento." } });

    // Assert
    expect(screen.getByRole("heading", { name: "No pudimos registrar tu solicitud" })).toBeInTheDocument();
    expect(screen.getByText("Stock insuficiente de Cemento.")).toBeInTheDocument();
  });

  it("muestra un mensaje por defecto cuando el error no trae motivo", () => {
    // Arrange + Act
    renderizar("/pedido/error");

    // Assert
    expect(screen.getByText("No pudimos registrar tu solicitud. Inténtalo nuevamente.")).toBeInTheDocument();
  });

  it("vuelve al checkout con el botón Reintentar", async () => {
    // Arrange
    renderizar("/pedido/error");

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Reintentar" }));

    // Assert
    expect(screen.getByText("Pantalla de checkout")).toBeInTheDocument();
  });
});
