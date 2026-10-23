import { render, screen } from "@testing-library/react";
import Precio from "./Precio";

describe("Precio", () => {
  it("formatea el valor como pesos chilenos", () => {
    // Arrange + Act
    render(<Precio valor={5990} />);

    // Assert
    expect(screen.getByText("$5.990")).toBeInTheDocument();
  });

  it("separa los miles en valores grandes", () => {
    // Arrange + Act
    render(<Precio valor={1234567} />);

    // Assert
    expect(screen.getByText("$1.234.567")).toBeInTheDocument();
  });

  it("muestra $0 cuando el valor es cero", () => {
    // Arrange + Act
    render(<Precio valor={0} />);

    // Assert
    expect(screen.getByText("$0")).toBeInTheDocument();
  });

  it("usa las clases por defecto", () => {
    // Arrange + Act
    render(<Precio valor={100} />);

    // Assert
    expect(screen.getByText("$100")).toHaveClass("fw-bold", "fs-5");
  });

  it("usa la clase recibida por props", () => {
    // Arrange + Act
    render(<Precio valor={100} className="small" />);

    // Assert
    expect(screen.getByText("$100")).toHaveClass("small");
    expect(screen.getByText("$100")).not.toHaveClass("fs-5");
  });
});
