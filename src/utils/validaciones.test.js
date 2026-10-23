import { esCorreoValido, validarContrasena } from "./validaciones";

describe("validaciones", () => {
  describe("esCorreoValido", () => {
    it.each(["nombre@correo.com", "a.b@dominio.cl", "  admin@maestros.cl  "])(
      "acepta el correo %s",
      (correo) => {
        // Arrange + Act
        const resultado = esCorreoValido(correo);

        // Assert
        expect(resultado).toBe(true);
      }
    );

    it.each(["", "sin-arroba", "a@b", "a@b.c", "con espacio@correo.com"])(
      "rechaza el correo '%s'",
      (correo) => {
        // Arrange + Act
        const resultado = esCorreoValido(correo);

        // Assert
        expect(resultado).toBe(false);
      }
    );
  });

  describe("validarContrasena", () => {
    it("devuelve texto vacío cuando la contraseña es válida", () => {
      // Arrange
      const contrasena = "Admin123!";

      // Act
      const error = validarContrasena(contrasena);

      // Assert
      expect(error).toBe("");
    });

    it("exige al menos 8 caracteres", () => {
      // Arrange
      const contrasena = "Ab1!";

      // Act
      const error = validarContrasena(contrasena);

      // Assert
      expect(error).toBe("La contraseña debe tener al menos 8 caracteres.");
    });

    it("exige una minúscula", () => {
      // Arrange
      const contrasena = "ABCDEFG1!";

      // Act
      const error = validarContrasena(contrasena);

      // Assert
      expect(error).toBe("La contraseña debe incluir al menos una minúscula.");
    });

    it("exige una mayúscula", () => {
      // Arrange
      const contrasena = "abcdefg1!";

      // Act
      const error = validarContrasena(contrasena);

      // Assert
      expect(error).toBe("La contraseña debe incluir al menos una mayúscula.");
    });

    it("exige un número", () => {
      // Arrange
      const contrasena = "Abcdefgh!";

      // Act
      const error = validarContrasena(contrasena);

      // Assert
      expect(error).toBe("La contraseña debe incluir al menos un número.");
    });

    it("exige un símbolo especial", () => {
      // Arrange
      const contrasena = "Abcdefg1";

      // Act
      const error = validarContrasena(contrasena);

      // Assert
      expect(error).toContain("un símbolo especial");
    });
  });
});
