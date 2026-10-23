import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route, useLocation, useParams } from "react-router-dom";
import { vi } from "vitest";
import Checkout from "./Checkout";
import { AuthProvider } from "../context/AuthContext";
import { CatalogoProvider } from "../context/CatalogoContext";
import { CarritoProvider } from "../context/CarritoContext";
import { reiniciarBase } from "../data/baseDatos";
import { obtenerProducto } from "../services/productosService";
import { crearPedido } from "../services/pedidosService";

// Se usa el servicio real, pero envuelto en vi.fn() para poder forzar un error en un test
vi.mock("../services/pedidosService", async (importOriginal) => {
  const original = await importOriginal();
  return { ...original, crearPedido: vi.fn(original.crearPedido) };
});

const CLIENTE = {
  id: 3, nombre: "Camila", apellidos: "Soto Reyes", correo: "cliente@maestros.cl",
  rol: "cliente", direccion: "Pasaje Los Olivos 12, Coquimbo", cuentaCorriente: false,
};
const CONTRATISTA = { ...CLIENTE, id: 2, nombre: "Carlos", correo: "contratista@maestros.cl", cuentaCorriente: true };

function guardarCarrito() {
  localStorage.setItem("ferreteria_carrito", JSON.stringify([{ codigo: "MC002", cantidad: 2 }]));
}

function iniciarSesionComo(usuario) {
  localStorage.setItem("ferreteria_sesion", JSON.stringify(usuario));
}

function Destino() {
  const { numero } = useParams();
  const location = useLocation();
  return <p>Destino {numero} {location.state && location.state.motivo}</p>;
}

function renderizar() {
  return render(
    <AuthProvider>
      <CatalogoProvider>
        <CarritoProvider>
          <MemoryRouter initialEntries={["/checkout"]}>
            <Routes>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/carrito" element={<p>Pantalla de carrito</p>} />
              <Route path="/pedido/:numero" element={<Destino />} />
            </Routes>
          </MemoryRouter>
        </CarritoProvider>
      </CatalogoProvider>
    </AuthProvider>
  );
}

async function completarDatos() {
  await userEvent.type(screen.getByLabelText("Nombre"), "Camila");
  await userEvent.type(screen.getByLabelText("Apellidos"), "Soto Reyes");
  await userEvent.type(screen.getByLabelText("Correo electrónico"), "camila@correo.cl");
}

function confirmar() {
  return userEvent.click(screen.getByRole("button", { name: "Confirmar solicitud" }));
}

describe("Checkout", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  it("redirige al carrito cuando no hay productos", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByText("Pantalla de carrito")).toBeInTheDocument();
  });

  it("muestra el formulario y el resumen de la solicitud", () => {
    // Arrange
    guardarCarrito();

    // Act
    renderizar();

    // Assert
    expect(screen.getByRole("button", { name: "Confirmar solicitud" })).toBeInTheDocument();
    expect(screen.getByText("Cemento Melón blanco 25 kg × 2")).toBeInTheDocument();
    expect(screen.getByText("$14.980")).toBeInTheDocument();
    expect(document.title).toBe("Confirmar solicitud | Ferretería Los Maestros");
  });

  it("completa los datos solo cuando hay sesión iniciada", () => {
    // Arrange
    guardarCarrito();
    iniciarSesionComo(CLIENTE);

    // Act
    renderizar();

    // Assert
    expect(screen.getByLabelText("Nombre")).toHaveValue("Camila");
    expect(screen.getByLabelText("Correo electrónico")).toHaveValue("cliente@maestros.cl");
  });

  it("avisa del pago pendiente a fin de mes a un cliente con cuenta corriente", () => {
    // Arrange
    guardarCarrito();
    iniciarSesionComo(CONTRATISTA);

    // Act
    renderizar();

    // Assert
    expect(screen.getByText(/pago pendiente a fin de mes/i)).toBeInTheDocument();
  });

  it("muestra los errores de validación y no registra el pedido", async () => {
    // Arrange
    guardarCarrito();
    renderizar();

    // Act
    await confirmar();

    // Assert
    expect(screen.getByText("El nombre es obligatorio.")).toBeInTheDocument();
    expect(screen.queryByText(/Destino/)).not.toBeInTheDocument();
  });

  it("registra el pedido, vacía el carrito y lleva al comprobante", async () => {
    // Arrange
    guardarCarrito();
    const stockAntes = obtenerProducto("MC002").stock;
    renderizar();
    await completarDatos();

    // Act
    await confirmar();

    // Assert
    expect(await screen.findByText("Destino FM-00001")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("ferreteria_carrito"))).toEqual([]);
    expect(obtenerProducto("MC002").stock).toBe(stockAntes - 2);
  });

  it("lleva a la pantalla de error y conserva el carrito cuando el pedido falla", async () => {
    // Arrange
    guardarCarrito();
    crearPedido.mockImplementationOnce(() => {
      throw new Error("Stock insuficiente de Cemento Melón blanco 25 kg: quedan 1.");
    });
    renderizar();
    await completarDatos();

    // Act
    await confirmar();

    // Assert
    expect(await screen.findByText(/Destino error Stock insuficiente/)).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("ferreteria_carrito"))).toEqual([
      { codigo: "MC002", cantidad: 2 },
    ]);
  });
});
