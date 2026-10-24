import { listarProductos, reiniciarBase } from "./baseDatos";

describe("baseDatos - imágenes de la semilla", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  it("asigna a cada producto la ruta /productos/<CODIGO>.jpg", () => {
    // Arrange + Act
    const productos = listarProductos();

    // Assert
    expect(productos.every((p) => p.imagen === `/productos/${p.codigo}.jpg`)).toBe(true);
  });
});
