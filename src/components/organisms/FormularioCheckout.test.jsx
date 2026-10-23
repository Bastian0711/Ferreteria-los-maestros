import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import FormularioCheckout from "./FormularioCheckout";

function renderizar(extra = {}) {
  const props = { onConfirmar: vi.fn(), ...extra };
  render(<FormularioCheckout {...props} />);
  return props;
}

async function completarDatos() {
  await userEvent.type(screen.getByLabelText("Nombre"), "Camila");
  await userEvent.type(screen.getByLabelText("Apellidos"), "Soto Reyes");
  await userEvent.type(screen.getByLabelText("Correo electrónico"), "camila@correo.cl");
}

function confirmar() {
  return userEvent.click(screen.getByRole("button", { name: "Confirmar solicitud" }));
}

describe("FormularioCheckout", () => {
  it("muestra los campos de la persona y el tipo de entrega", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
    expect(screen.getByLabelText("Apellidos")).toBeInTheDocument();
    expect(screen.getByLabelText("Correo electrónico")).toBeInTheDocument();
    expect(screen.getByLabelText("Tipo de entrega")).toHaveValue("retiro");
  });

  it("parte con los datos de la sesión cuando se reciben", () => {
    // Arrange
    const datosIniciales = { nombre: "Camila", apellidos: "Soto Reyes", correo: "cliente@maestros.cl" };

    // Act
    renderizar({ datosIniciales });

    // Assert
    expect(screen.getByLabelText("Nombre")).toHaveValue("Camila");
    expect(screen.getByLabelText("Apellidos")).toHaveValue("Soto Reyes");
    expect(screen.getByLabelText("Correo electrónico")).toHaveValue("cliente@maestros.cl");
  });

  it("muestra errores y no confirma cuando los campos están vacíos", async () => {
    // Arrange
    const props = renderizar();

    // Act
    await confirmar();

    // Assert
    expect(screen.getByText("El nombre es obligatorio.")).toBeInTheDocument();
    expect(screen.getByText("Los apellidos son obligatorios.")).toBeInTheDocument();
    expect(screen.getByText("El correo es obligatorio.")).toBeInTheDocument();
    expect(props.onConfirmar).not.toHaveBeenCalled();
  });

  it("rechaza un correo con formato inválido", async () => {
    // Arrange
    const props = renderizar();
    await userEvent.type(screen.getByLabelText("Nombre"), "Camila");
    await userEvent.type(screen.getByLabelText("Apellidos"), "Soto");
    await userEvent.type(screen.getByLabelText("Correo electrónico"), "correo-malo");

    // Act
    await confirmar();

    // Assert
    expect(screen.getByText(/Ingresa un correo válido/)).toBeInTheDocument();
    expect(props.onConfirmar).not.toHaveBeenCalled();
  });

  it("no pide dirección cuando la entrega es retiro en tienda", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.queryByLabelText("Dirección de despacho")).not.toBeInTheDocument();
  });

  it("pide la dirección cuando se elige despacho y la exige", async () => {
    // Arrange
    const props = renderizar();
    await completarDatos();
    await userEvent.selectOptions(screen.getByLabelText("Tipo de entrega"), "despacho");

    // Act
    await confirmar();

    // Assert
    expect(screen.getByText("La dirección es obligatoria para el despacho.")).toBeInTheDocument();
    expect(props.onConfirmar).not.toHaveBeenCalled();
  });

  it("entrega los datos al confirmar un retiro en tienda", async () => {
    // Arrange
    const props = renderizar();
    await completarDatos();

    // Act
    await confirmar();

    // Assert
    expect(props.onConfirmar).toHaveBeenCalledWith({
      nombre: "Camila",
      apellidos: "Soto Reyes",
      correo: "camila@correo.cl",
      entrega: { tipo: "retiro", direccion: "" },
    });
  });

  it("entrega la dirección al confirmar un despacho", async () => {
    // Arrange
    const props = renderizar();
    await completarDatos();
    await userEvent.selectOptions(screen.getByLabelText("Tipo de entrega"), "despacho");
    await userEvent.type(screen.getByLabelText("Dirección de despacho"), "Av. Siempre Viva 123");

    // Act
    await confirmar();

    // Assert
    expect(props.onConfirmar).toHaveBeenCalledWith({
      nombre: "Camila",
      apellidos: "Soto Reyes",
      correo: "camila@correo.cl",
      entrega: { tipo: "despacho", direccion: "Av. Siempre Viva 123" },
    });
  });

  it("avisa del pago pendiente a fin de mes cuando hay cuenta corriente", () => {
    // Arrange + Act
    renderizar({ cuentaCorriente: true });

    // Assert
    expect(screen.getByText(/pago pendiente a fin de mes/i)).toBeInTheDocument();
  });

  it("no muestra ese aviso cuando no hay cuenta corriente", () => {
    // Arrange + Act
    renderizar({ cuentaCorriente: false });

    // Assert
    expect(screen.queryByText(/pago pendiente a fin de mes/i)).not.toBeInTheDocument();
  });
});
