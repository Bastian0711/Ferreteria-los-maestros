import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CampoCasilla from "./CampoCasilla";

describe("CampoCasilla", () => {
  it("muestra la etiqueta y el estado marcado", () => {
    // Arrange + Act
    render(<CampoCasilla id="c1" label="Producto destacado" checked={true} onChange={() => {}} />);

    // Assert
    expect(screen.getByLabelText("Producto destacado")).toBeChecked();
  });

  it("avisa cuando el usuario la marca", async () => {
    // Arrange
    const onChange = vi.fn();
    render(<CampoCasilla id="c1" label="Producto destacado" checked={false} onChange={onChange} />);

    // Act
    await userEvent.click(screen.getByLabelText("Producto destacado"));

    // Assert
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
