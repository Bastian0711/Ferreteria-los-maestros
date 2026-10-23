import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Inicio from "./Inicio";

describe("Inicio", () => {
  it("muestra el título de la tienda y fija el título de la pestaña", () => {
    // Arrange + Act
    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByRole("heading", { level: 1, name: "Ferretería Los Maestros" })).toBeInTheDocument();
    expect(document.title).toBe("Inicio | Ferretería Los Maestros");
  });
});
