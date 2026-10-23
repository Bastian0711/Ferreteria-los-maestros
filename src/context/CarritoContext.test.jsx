import { useState } from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CatalogoProvider } from "./CatalogoContext";
import { CarritoProvider, useCarrito } from "./CarritoContext";
import { reiniciarBase } from "../data/baseDatos";
import { actualizarProducto, eliminarProducto } from "../services/productosService";

// Productos de la semilla que usan estos tests:
//   MC002: $7.490, sin oferta, stock 40.   MC001: en oferta a $5.090.

function Panel() {
  const { items, total, cantidadTotal, agregar, quitar, cambiarCantidad, limpiar } = useCarrito();
  const [resultado, setResultado] = useState("");

  return (
    <div>
      <p data-testid="lineas">{items.map((i) => `${i.codigo}:${i.cantidad}`).join(",")}</p>
      <p data-testid="total">{total}</p>
      <p data-testid="unidades">{cantidadTotal}</p>
      <p data-testid="resultado">{resultado}</p>
      <button onClick={() => setResultado(String(agregar("MC002", 1)))}>Agregar MC002</button>
      <button onClick={() => setResultado(String(agregar("MC002", 100)))}>Agregar 100 de MC002</button>
      <button onClick={() => agregar("MC001", 1)}>Agregar MC001</button>
      <button onClick={() => cambiarCantidad("MC002", 5)}>Poner 5 de MC002</button>
      <button onClick={() => quitar("MC002")}>Quitar MC002</button>
      <button onClick={limpiar}>Limpiar</button>
    </div>
  );
}

function renderizar() {
  return render(
    <CatalogoProvider>
      <CarritoProvider>
        <Panel />
      </CarritoProvider>
    </CatalogoProvider>
  );
}

function pulsar(nombre) {
  return userEvent.click(screen.getByRole("button", { name: nombre }));
}

function texto(id) {
  return screen.getByTestId(id).textContent;
}

describe("CarritoContext", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  it("empieza vacío", () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(texto("lineas")).toBe("");
    expect(texto("total")).toBe("0");
    expect(texto("unidades")).toBe("0");
  });

  it("agrega un producto y calcula el total", async () => {
    // Arrange
    renderizar();

    // Act
    await pulsar("Agregar MC002");

    // Assert
    expect(texto("lineas")).toBe("MC002:1");
    expect(texto("total")).toBe("7490");
  });

  it("suma las cantidades cuando se agrega el mismo producto", async () => {
    // Arrange
    renderizar();

    // Act
    await pulsar("Agregar MC002");
    await pulsar("Agregar MC002");

    // Assert
    expect(texto("lineas")).toBe("MC002:2");
    expect(texto("total")).toBe("14980");
    expect(texto("unidades")).toBe("2");
  });

  it("usa el precio de oferta cuando el producto está en oferta", async () => {
    // Arrange
    renderizar();

    // Act
    await pulsar("Agregar MC001");

    // Assert
    expect(texto("total")).toBe("5090");
  });

  it("no agrega si la cantidad supera el stock", async () => {
    // Arrange
    renderizar();

    // Act
    await pulsar("Agregar 100 de MC002");

    // Assert
    expect(texto("resultado")).toBe("false");
    expect(texto("lineas")).toBe("");
  });

  it("cambia la cantidad de un producto", async () => {
    // Arrange
    renderizar();
    await pulsar("Agregar MC002");

    // Act
    await pulsar("Poner 5 de MC002");

    // Assert
    expect(texto("lineas")).toBe("MC002:5");
    expect(texto("total")).toBe("37450");
  });

  it("quita un producto del carrito", async () => {
    // Arrange
    renderizar();
    await pulsar("Agregar MC002");

    // Act
    await pulsar("Quitar MC002");

    // Assert
    expect(texto("lineas")).toBe("");
  });

  it("limpia todo el carrito", async () => {
    // Arrange
    renderizar();
    await pulsar("Agregar MC002");
    await pulsar("Agregar MC001");

    // Act
    await pulsar("Limpiar");

    // Assert
    expect(texto("lineas")).toBe("");
    expect(texto("total")).toBe("0");
  });

  it("guarda solo códigos y cantidades en localStorage", async () => {
    // Arrange
    renderizar();

    // Act
    await pulsar("Agregar MC002");

    // Assert
    const guardado = JSON.parse(localStorage.getItem("ferreteria_carrito"));
    expect(guardado).toEqual([{ codigo: "MC002", cantidad: 1 }]);
  });

  it("recupera el carrito guardado al cargar la página", () => {
    // Arrange
    localStorage.setItem("ferreteria_carrito", JSON.stringify([{ codigo: "MC002", cantidad: 3 }]));

    // Act
    renderizar();

    // Assert
    expect(texto("lineas")).toBe("MC002:3");
  });

  it("ignora un carrito guardado con datos corruptos", () => {
    // Arrange
    localStorage.setItem("ferreteria_carrito", "{esto no es json");

    // Act
    renderizar();

    // Assert
    expect(texto("lineas")).toBe("");
  });

  it("no muestra productos que fueron eliminados del catálogo", () => {
    // Arrange
    localStorage.setItem("ferreteria_carrito", JSON.stringify([{ codigo: "MC002", cantidad: 2 }]));
    eliminarProducto("MC002");

    // Act
    renderizar();

    // Assert
    expect(texto("lineas")).toBe("");
    expect(texto("total")).toBe("0");
  });

  it("actualiza el total cuando cambia el precio en el catálogo", async () => {
    // Arrange
    renderizar();
    await pulsar("Agregar MC002");

    // Act
    act(() => {
      actualizarProducto("MC002", { precioVenta: 8000 });
    });

    // Assert
    expect(texto("total")).toBe("8000");
  });

  it("useCarrito funciona sin provider y entrega un carrito vacío", async () => {
    // Arrange
    render(<Panel />);

    // Act
    await pulsar("Agregar MC002");

    // Assert
    expect(texto("resultado")).toBe("false");
    expect(texto("total")).toBe("0");
  });
});
