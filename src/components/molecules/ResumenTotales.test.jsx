import { render, screen } from "@testing-library/react";
import ResumenTotales from "./ResumenTotales";

describe("ResumenTotales", () => {
  it("muestra la cantidad de productos", () => {
    // Arrange + Act
    render(<ResumenTotales cantidad={3} total={20070} />);

    // Assert
    expect(screen.getByText("Productos")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("muestra el total formateado en pesos", () => {
    // Arrange + Act
    render(<ResumenTotales cantidad={3} total={20070} />);

    // Assert
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("$20.070")).toBeInTheDocument();
  });

  it("muestra $0 cuando no hay total", () => {
    // Arrange + Act
    render(<ResumenTotales cantidad={0} total={0} />);

    // Assert
    expect(screen.getByText("$0")).toBeInTheDocument();
  });
});
