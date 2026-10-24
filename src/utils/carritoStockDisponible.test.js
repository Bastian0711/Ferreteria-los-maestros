import { conStockDisponible } from "./carrito";

const productos = [
  { codigo: "A1", nombre: "Martillo", stock: 10 },
  { codigo: "A2", nombre: "Pala", stock: 3 },
];

describe("conStockDisponible", () => {
  it("descuenta del stock lo que hay en el carrito", () => {
    // Arrange
    const lineas = [{ codigo: "A1", cantidad: 4 }];

    // Act
    const resultado = conStockDisponible(productos, lineas);

    // Assert
    expect(resultado[0].stock).toBe(6);
    expect(resultado[1].stock).toBe(3);
  });

  it("no baja de cero", () => {
    // Arrange
    const lineas = [{ codigo: "A2", cantidad: 99 }];

    // Act
    const resultado = conStockDisponible(productos, lineas);

    // Assert
    expect(resultado[1].stock).toBe(0);
  });

  it("devuelve los mismos datos si el carrito está vacío", () => {
    // Arrange + Act
    const resultado = conStockDisponible(productos, []);

    // Assert
    expect(resultado).toEqual(productos);
  });

  it("no modifica los productos originales", () => {
    // Arrange
    const lineas = [{ codigo: "A1", cantidad: 4 }];

    // Act
    conStockDisponible(productos, lineas);

    // Assert
    expect(productos[0].stock).toBe(10);
  });
});
