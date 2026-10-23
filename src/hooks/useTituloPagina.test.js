import { renderHook } from "@testing-library/react";
import { useTituloPagina } from "./useTituloPagina";

describe("useTituloPagina", () => {
  it("fija el título del documento con el nombre de la tienda", () => {
    // Arrange + Act
    renderHook(() => useTituloPagina("Catálogo"));

    // Assert
    expect(document.title).toBe("Catálogo | Ferretería Los Maestros");
  });

  it("actualiza el título cuando cambia el texto", () => {
    // Arrange
    const { rerender } = renderHook(({ titulo }) => useTituloPagina(titulo), {
      initialProps: { titulo: "Inicio" },
    });

    // Act
    rerender({ titulo: "Contacto" });

    // Assert
    expect(document.title).toBe("Contacto | Ferretería Los Maestros");
  });
});
