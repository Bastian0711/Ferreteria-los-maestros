import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MensajeNoEncontrado from "./MensajeNoEncontrado";

describe("MensajeNoEncontrado", () => {
  it("muestra código, título y descripción", () => {
    // Arrange + Act
    render(
      <MensajeNoEncontrado codigo="404" titulo="No existe" descripcion="Vuelve al inicio." textoBoton="Volver" onVolver={() => {}} />
    );

    // Assert
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "No existe" })).toBeInTheDocument();
    expect(screen.getByText("Vuelve al inicio.")).toBeInTheDocument();
  });

  it("llama a onVolver al pulsar el botón", async () => {
    // Arrange
    const onVolver = vi.fn();
    render(<MensajeNoEncontrado codigo="404" titulo="x" descripcion="y" textoBoton="Volver" onVolver={onVolver} />);

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Volver" }));

    // Assert
    expect(onVolver).toHaveBeenCalledTimes(1);
  });
});
