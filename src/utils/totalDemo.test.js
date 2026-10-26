import { calcularTotal } from "./totalDemo";

describe("calcularTotal", () => {
  it("multiplica el precio por la cantidad de cada producto", () => {
    // Arrange
    const lineas = [
      { codigo: "MC001", precio: 1000, cantidad: 3 },
      { codigo: "HM002", precio: 500, cantidad: 2 },
    ];

    // Act
    const total = calcularTotal(lineas);
    //total += linea.precio * linea.cantidad;
    // Assert
    expect(total).toBe(4000); // 1000×3 + 500×2
  });
});