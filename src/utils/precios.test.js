import { estaEnOferta, precioFinal } from "./precios";

describe("precios", () => {
  describe("estaEnOferta", () => {
    it("es verdadero con la oferta activa y un precio de oferta", () => {
      // Arrange
      const producto = { oferta: true, precioOferta: 5090, precioVenta: 5990 };

      // Act
      const resultado = estaEnOferta(producto);

      // Assert
      expect(resultado).toBe(true);
    });

    it("es falso si la oferta está desactivada", () => {
      // Arrange
      const producto = { oferta: false, precioOferta: 5090, precioVenta: 5990 };

      // Act
      const resultado = estaEnOferta(producto);

      // Assert
      expect(resultado).toBe(false);
    });

    it("es falso si no hay precio de oferta cargado", () => {
      // Arrange
      const producto = { oferta: true, precioOferta: null, precioVenta: 5990 };

      // Act
      const resultado = estaEnOferta(producto);

      // Assert
      expect(resultado).toBe(false);
    });
  });

  describe("precioFinal", () => {
    it("devuelve el precio de oferta cuando el producto está en oferta", () => {
      // Arrange
      const producto = { oferta: true, precioOferta: 5090, precioVenta: 5990 };

      // Act
      const precio = precioFinal(producto);

      // Assert
      expect(precio).toBe(5090);
    });

    it("devuelve el precio de venta cuando no hay oferta", () => {
      // Arrange
      const producto = { oferta: false, precioOferta: null, precioVenta: 5990 };

      // Act
      const precio = precioFinal(producto);

      // Assert
      expect(precio).toBe(5990);
    });
  });
});
