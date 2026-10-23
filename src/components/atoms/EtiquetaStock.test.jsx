import { render, screen } from "@testing-library/react";
import EtiquetaStock from "./EtiquetaStock";

describe("EtiquetaStock", () => {
  it("muestra el stock en verde cuando es alto", () => {
    // Arrange + Act
    render(<EtiquetaStock stock={50} />);

    // Assert
    const etiqueta = screen.getByText("Stock: 50");
    expect(etiqueta).toHaveClass("bg-success");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("avisa con una alerta cuando el stock es bajo", () => {
    // Arrange + Act
    render(<EtiquetaStock stock={5} />);

    // Assert
    expect(screen.getByRole("alert")).toHaveTextContent("¡Solo quedan 5 productos!");
    expect(screen.getByRole("alert")).toHaveClass("bg-warning");
  });

  it("usa el singular cuando queda un solo producto", () => {
    // Arrange + Act
    render(<EtiquetaStock stock={1} />);

    // Assert
    expect(screen.getByRole("alert")).toHaveTextContent("¡Solo queda 1 producto!");
  });

  it("muestra Sin stock en rojo cuando no quedan productos", () => {
    // Arrange + Act
    render(<EtiquetaStock stock={0} />);

    // Assert
    expect(screen.getByText("Sin stock")).toHaveClass("bg-danger");
  });

  it("considera bajo el stock igual al umbral", () => {
    // Arrange + Act
    render(<EtiquetaStock stock={10} umbral={10} />);

    // Assert
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("respeta un umbral personalizado", () => {
    // Arrange + Act
    render(<EtiquetaStock stock={15} umbral={20} />);

    // Assert
    expect(screen.getByRole("alert")).toHaveTextContent("¡Solo quedan 15 productos!");
  });
});
