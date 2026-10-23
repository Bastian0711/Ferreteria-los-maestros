import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import CampoSelector from "./CampoSelector";

const OPCIONES = [
  { value: "retiro", label: "Retiro en tienda" },
  { value: "despacho", label: "Despacho a domicilio" },
];

function renderizar(extra = {}) {
  const props = {
    id: "entrega",
    label: "Tipo de entrega",
    opciones: OPCIONES,
    value: "retiro",
    onChange: vi.fn(),
    ...extra,
  };
  render(<CampoSelector {...props} />);
  return props;
}

describe("CampoSelector", () => {
  it("asocia la etiqueta con la lista desplegable", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByLabelText("Tipo de entrega")).toBeInTheDocument();
  });

  it("muestra las opciones recibidas", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByRole("option", { name: "Despacho a domicilio" })).toBeInTheDocument();
  });

  it("llama a onChange al elegir otra opción", async () => {
    // Arrange
    const props = renderizar();

    // Act
    await userEvent.selectOptions(screen.getByLabelText("Tipo de entrega"), "despacho");

    // Assert
    expect(props.onChange).toHaveBeenCalledTimes(1);
  });

  it("muestra el mensaje de error cuando existe", () => {
    // Arrange + Act
    renderizar({ error: "Elige una opción." });

    // Assert
    expect(screen.getByText("Elige una opción.")).toBeInTheDocument();
  });

  it("no muestra mensaje de error cuando no hay error", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.queryByText("Elige una opción.")).not.toBeInTheDocument();
  });
});
