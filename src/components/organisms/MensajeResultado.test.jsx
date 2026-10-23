import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import MensajeResultado from "./MensajeResultado";

describe("MensajeResultado", () => {
  it("muestra el título y la descripción", () => {
    // Arrange + Act
    render(
      <MensajeResultado
        titulo="No pudimos registrar tu solicitud"
        descripcion="Falta stock."
        textoBoton="Reintentar"
        onAccion={vi.fn()}
      />
    );

    // Assert
    expect(screen.getByRole("heading", { name: "No pudimos registrar tu solicitud" })).toBeInTheDocument();
    expect(screen.getByText("Falta stock.")).toBeInTheDocument();
  });

  it("llama a onAccion al pulsar el botón", async () => {
    // Arrange
    const onAccion = vi.fn();
    render(<MensajeResultado titulo="Error" descripcion="x" textoBoton="Reintentar" onAccion={onAccion} />);

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Reintentar" }));

    // Assert
    expect(onAccion).toHaveBeenCalledTimes(1);
  });

  it("usa el estilo de error por defecto y el de éxito si se indica", () => {
    // Arrange + Act
    const { container, rerender } = render(
      <MensajeResultado titulo="T" descripcion="D" textoBoton="B" />
    );
    const claseError = container.querySelector(".display-1").className;
    rerender(<MensajeResultado tipo="exito" titulo="T" descripcion="D" textoBoton="B" />);
    const claseExito = container.querySelector(".display-1").className;

    // Assert
    expect(claseError).toContain("text-danger");
    expect(claseExito).toContain("text-success");
  });
});
