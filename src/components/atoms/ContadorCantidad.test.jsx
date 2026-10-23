import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ContadorCantidad from "./ContadorCantidad";

const MENOS = "−"; // el signo − que usa el botón de restar
const MAS = "+";

describe("ContadorCantidad", () => {
  it("muestra el valor recibido", () => {
    // Arrange + Act
    render(<ContadorCantidad value={3} onChange={vi.fn()} />);

    // Assert
    expect(screen.getByDisplayValue("3")).toBeInTheDocument();
  });

  it("llama a onChange con el valor aumentado al pulsar +", async () => {
    // Arrange
    const onChange = vi.fn();
    render(<ContadorCantidad value={3} onChange={onChange} />);

    // Act
    await userEvent.click(screen.getByRole("button", { name: MAS }));

    // Assert
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("llama a onChange con el valor reducido al pulsar −", async () => {
    // Arrange
    const onChange = vi.fn();
    render(<ContadorCantidad value={3} onChange={onChange} />);

    // Act
    await userEvent.click(screen.getByRole("button", { name: MENOS }));

    // Assert
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("deshabilita − cuando el valor está en el mínimo", () => {
    // Arrange + Act
    render(<ContadorCantidad value={1} onChange={vi.fn()} />);

    // Assert
    expect(screen.getByRole("button", { name: MENOS })).toBeDisabled();
  });

  it("deshabilita + cuando el valor está en el máximo", () => {
    // Arrange + Act
    render(<ContadorCantidad value={5} max={5} onChange={vi.fn()} />);

    // Assert
    expect(screen.getByRole("button", { name: MAS })).toBeDisabled();
  });

  it("respeta un mínimo personalizado", () => {
    // Arrange + Act
    render(<ContadorCantidad value={0} min={0} onChange={vi.fn()} />);

    // Assert
    expect(screen.getByRole("button", { name: MENOS })).toBeDisabled();
    expect(screen.getByRole("button", { name: MAS })).toBeEnabled();
  });
});
