import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useCatalogo } from "./CatalogoContext";
import { precioFinal } from "../services/productosService";
import {
  agregarLinea,
  cambiarCantidadLinea,
  quitarLinea,
  sanitizarLineas,
} from "../utils/carrito";

const CLAVE_CARRITO = "ferreteria_carrito";

// Valor por defecto (sin provider): carrito vacio que no hace nada
const CarritoContext = createContext({
  items: [],
  total: 0,
  cantidadTotal: 0,
  agregar: () => false,
  quitar: () => {},
  cambiarCantidad: () => {},
  limpiar: () => {},
});

function leerCarrito() {
  try {
    const texto = localStorage.getItem(CLAVE_CARRITO);
    return texto ? sanitizarLineas(JSON.parse(texto)) : [];
  } catch {
    return [];
  }
}

export function CarritoProvider(props) {
  const { productos } = useCatalogo();

  const [lineas, setLineas] = useState(leerCarrito);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(lineas));
    } catch {
      // Sin localStorage el carrito dura solo mientras la pestaña este abierta
    }
  }, [lineas]);

  const items = useMemo(
    () =>
      lineas.flatMap((linea) => {
        const producto = productos.find((p) => p.codigo === linea.codigo);
        if (!producto) return [];

        const precioUnitario = precioFinal(producto);
        return [
          {
            codigo: producto.codigo,
            nombre: producto.nombre,
            unidad: producto.unidad,
            imagen: producto.imagen,
            stock: producto.stock,
            cantidad: linea.cantidad,
            precioUnitario,
            subtotal: precioUnitario * linea.cantidad,
          },
        ];
      }),
    [lineas, productos]
  );

  const total = items.reduce((suma, item) => suma + item.subtotal, 0);
  const cantidadTotal = items.reduce((suma, item) => suma + item.cantidad, 0);

  function stockDe(codigo) {
    const producto = productos.find((p) => p.codigo === codigo);
    return producto ? producto.stock : 0;
  }

  // Devuelve true si se agrego, false si no (producto inexistente o superaria el stock)
  function agregar(codigo, cantidad = 1) {
    const resultado = agregarLinea(lineas, codigo, cantidad, stockDe(codigo));
    if (resultado.agregado) setLineas(resultado.lineas);
    return resultado.agregado;
  }

  function quitar(codigo) {
    setLineas(quitarLinea(lineas, codigo));
  }

  function cambiarCantidad(codigo, cantidad) {
    setLineas(cambiarCantidadLinea(lineas, codigo, cantidad, stockDe(codigo)));
  }

  function limpiar() {
    setLineas([]);
  }

  const valor = { items, total, cantidadTotal, agregar, quitar, cambiarCantidad, limpiar };

  return <CarritoContext.Provider value={valor}>{props.children}</CarritoContext.Provider>;
}

// eslint-disable-next-line react/only-export-components
export function useCarrito() {
  return useContext(CarritoContext);
}
