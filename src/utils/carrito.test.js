import {
  agregarLinea,
  cambiarCantidadLinea,
  quitarLinea,
  sanitizarLineas,
} from "./carrito";

describe("carrito (funciones puras)", () => {
  describe("agregarLinea", () => {
    it("crea una línea nueva si el producto no estaba", () => {
      // Arrange
      const lineas = [];

      // Act
      const resultado = agregarLinea(lineas, "MC001", 2, 10);

      // Assert
      expect(resultado.agregado).toBe(true);
      expect(resultado.lineas).toEqual([{ codigo: "MC001", cantidad: 2 }]);
    });

    it("suma la cantidad si el producto ya estaba", () => {
      // Arrange
      const lineas = [{ codigo: "MC001", cantidad: 2 }];

      // Act
      const resultado = agregarLinea(lineas, "MC001", 3, 10);

      // Assert
      expect(resultado.lineas).toEqual([{ codigo: "MC001", cantidad: 5 }]);
    });

    it("no modifica el arreglo original", () => {
      // Arrange
      const lineas = [{ codigo: "MC001", cantidad: 1 }];

      // Act
      agregarLinea(lineas, "MC001", 1, 10);

      // Assert
      expect(lineas).toEqual([{ codigo: "MC001", cantidad: 1 }]);
    });

    it("no agrega si el total superaría el stock", () => {
      // Arrange
      const lineas = [{ codigo: "MC001", cantidad: 4 }];

      // Act
      const resultado = agregarLinea(lineas, "MC001", 2, 5);

      // Assert
      expect(resultado.agregado).toBe(false);
      expect(resultado.lineas).toBe(lineas);
    });

    it("no agrega si el producto no tiene stock", () => {
      // Arrange
      const lineas = [];

      // Act
      const resultado = agregarLinea(lineas, "JA005", 1, 0);

      // Assert
      expect(resultado.agregado).toBe(false);
    });

    it.each([0, -1, 1.5])("rechaza la cantidad inválida %s", (cantidad) => {
      // Arrange
      const lineas = [];

      // Act
      const resultado = agregarLinea(lineas, "MC001", cantidad, 10);

      // Assert
      expect(resultado.agregado).toBe(false);
    });
  });

  describe("cambiarCantidadLinea", () => {
    it("actualiza la cantidad de la línea", () => {
      // Arrange
      const lineas = [{ codigo: "MC001", cantidad: 1 }];

      // Act
      const resultado = cambiarCantidadLinea(lineas, "MC001", 4, 10);

      // Assert
      expect(resultado).toEqual([{ codigo: "MC001", cantidad: 4 }]);
    });

    it("limita la cantidad al stock disponible", () => {
      // Arrange
      const lineas = [{ codigo: "MC001", cantidad: 1 }];

      // Act
      const resultado = cambiarCantidadLinea(lineas, "MC001", 99, 10);

      // Assert
      expect(resultado).toEqual([{ codigo: "MC001", cantidad: 10 }]);
    });

    it("elimina la línea si la cantidad es 0", () => {
      // Arrange
      const lineas = [{ codigo: "MC001", cantidad: 3 }];

      // Act
      const resultado = cambiarCantidadLinea(lineas, "MC001", 0, 10);

      // Assert
      expect(resultado).toEqual([]);
    });
  });

  describe("quitarLinea", () => {
    it("elimina solo la línea indicada", () => {
      // Arrange
      const lineas = [
        { codigo: "MC001", cantidad: 1 },
        { codigo: "MC002", cantidad: 2 },
      ];

      // Act
      const resultado = quitarLinea(lineas, "MC001");

      // Assert
      expect(resultado).toEqual([{ codigo: "MC002", cantidad: 2 }]);
    });
  });

  describe("sanitizarLineas", () => {
    it("descarta las líneas inválidas y deja solo código y cantidad", () => {
      // Arrange
      const valor = [
        { codigo: "MC001", cantidad: 2, extra: "x" },
        { codigo: 5, cantidad: 2 },
        { codigo: "MC002", cantidad: 0 },
        { codigo: "MC003", cantidad: 1.5 },
        null,
      ];

      // Act
      const resultado = sanitizarLineas(valor);

      // Assert
      expect(resultado).toEqual([{ codigo: "MC001", cantidad: 2 }]);
    });

    it("devuelve un arreglo vacío si el valor no es un arreglo", () => {
      // Arrange
      const valor = "texto corrupto";

      // Act
      const resultado = sanitizarLineas(valor);

      // Assert
      expect(resultado).toEqual([]);
    });
  });
});
