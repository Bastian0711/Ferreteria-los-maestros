import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Contacto from "./Contacto";

function renderizar() {
  return render(
    <MemoryRouter>
      <Contacto />
    </MemoryRouter>
  );
}

describe("Contacto", () => {
  it("muestra el formulario y fija el título", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(screen.getByRole("heading", { level: 1, name: "Contáctanos" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enviar mensaje" })).toBeInTheDocument();
    expect(document.title).toBe("Contáctanos | Ferretería Los Maestros");
  });

  it("confirma la recepción al enviar un mensaje válido", async () => {
    // Arrange
    renderizar();
    await userEvent.type(screen.getByLabelText("Nombre"), "Ana");
    await userEvent.type(screen.getByLabelText("Correo electrónico"), "ana@correo.cl");
    await userEvent.type(screen.getByLabelText("Mensaje"), "Necesito cotizar");

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    // Assert
    expect(screen.getByText("Gracias, Ana. Recibimos tu mensaje.")).toBeInTheDocument();
  });
});
