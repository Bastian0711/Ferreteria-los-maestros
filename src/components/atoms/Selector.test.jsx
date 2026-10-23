import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Selector from "./Selector";

const OPCIONES = [
  { value: "a", label: "Opción A" },
  { value: "b", label: "Opción B" },
];

describe("Selector", () => {
  it("muestra todas las opciones recibidas", () => {
    // Arrange + Act
    render(<Selector opciones={OPCIONES} value="" onChange={vi.fn()} />);

    // Assert
    expect(screen.getByRole("option", { name: "Opción A" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Opción B" })).toBeInTheDocument();
  });

  it("muestra la opción vacía cuando hay placeholder", () => {
    // Arrange + Act
    render(<Selector opciones={OPCIONES} placeholder="Elige una" value="" onChange={vi.fn()} />);

    // Assert
    expect(screen.getByRole("option", { name: "Elige una" }).value).toBe("");
  });

  it("no muestra opción vacía cuando no hay placeholder", () => {
    // Arrange + Act
    render(<Selector opciones={OPCIONES} value="a" onChange={vi.fn()} />);

    // Assert
    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  it("muestra seleccionado el valor recibido", () => {
    // Arrange + Act
    render(<Selector opciones={OPCIONES} value="b" onChange={vi.fn()} />);

    // Assert
    expect(screen.getByRole("combobox")).toHaveValue("b");
  });

  it("llama a onChange al elegir una opción", async () => {
    // Arrange
    const onChange = vi.fn();
    render(<Selector opciones={OPCIONES} value="a" onChange={onChange} />);

    // Act
    await userEvent.selectOptions(screen.getByRole("combobox"), "b");

    // Assert
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("funciona sin opciones", () => {
    // Arrange + Act
    render(<Selector placeholder="Sin datos" value="" onChange={vi.fn()} />);

    // Assert
    expect(screen.getAllByRole("option")).toHaveLength(1);
  });
});
