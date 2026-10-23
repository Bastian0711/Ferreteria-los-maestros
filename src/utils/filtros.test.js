import { filtrarProductos } from "./filtros";

const PRODUCTOS = [
  { codigo: "MC001", nombre: "Cemento Polpaico gris 25 kg", marca: "Polpaico", categoriaId: "materiales" },
  { codigo: "PT004", nombre: "Esmalte sintético 1/4 litro", marca: "Sipa", categoriaId: "pinturas" },
  { codigo: "MC003", nombre: "Mortero cola cerámica 25 kg", marca: "Volcán", categoriaId: "materiales" },
];

describe("filtrarProductos", () => {
  it("devuelve todos los productos cuando no hay filtros", () => {
    // Arrange
    const filtros = { texto: "", categoriaId: "" };

    // Act
    const resultado = filtrarProductos(PRODUCTOS, filtros);

    // Assert
    expect(resultado).toHaveLength(3);
  });

  it("filtra por texto en el nombre sin distinguir mayúsculas", () => {
    // Arrange
    const filtros = { texto: "CEMENTO" };

    // Act
    const resultado = filtrarProductos(PRODUCTOS, filtros);

    // Assert
    expect(resultado).toHaveLength(1);
    expect(resultado[0].codigo).toBe("MC001");
  });

  it("filtra por texto en la marca", () => {
    // Arrange
    const filtros = { texto: "sipa" };

    // Act
    const resultado = filtrarProductos(PRODUCTOS, filtros);

    // Assert
    expect(resultado[0].codigo).toBe("PT004");
  });

  it("ignora las tildes al buscar", () => {
    // Arrange
    const filtros = { texto: "ceramica" };

    // Act
    const resultado = filtrarProductos(PRODUCTOS, filtros);

    // Assert
    expect(resultado[0].codigo).toBe("MC003");
  });

  it("filtra por categoría", () => {
    // Arrange
    const filtros = { categoriaId: "materiales" };

    // Act
    const resultado = filtrarProductos(PRODUCTOS, filtros);

    // Assert
    expect(resultado).toHaveLength(2);
  });

  it("combina texto y categoría", () => {
    // Arrange
    const filtros = { texto: "mortero", categoriaId: "materiales" };

    // Act
    const resultado = filtrarProductos(PRODUCTOS, filtros);

    // Assert
    expect(resultado).toHaveLength(1);
    expect(resultado[0].codigo).toBe("MC003");
  });

  it("devuelve una lista vacía si nada coincide", () => {
    // Arrange
    const filtros = { texto: "zzzz" };

    // Act
    const resultado = filtrarProductos(PRODUCTOS, filtros);

    // Assert
    expect(resultado).toEqual([]);
  });

  it("no modifica la lista original", () => {
    // Arrange
    const copia = [...PRODUCTOS];

    // Act
    filtrarProductos(PRODUCTOS, { texto: "cemento" });

    // Assert
    expect(PRODUCTOS).toEqual(copia);
  });
});
