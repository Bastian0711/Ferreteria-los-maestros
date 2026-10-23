export function quitarLinea(lineas, codigo) {
  return lineas.filter((linea) => linea.codigo !== codigo);
}

export function agregarLinea(lineas, codigo, cantidad, stock) {
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    return { lineas, agregado: false };
  }

  const existente = lineas.find((linea) => linea.codigo === codigo);
  const nueva = (existente ? existente.cantidad : 0) + cantidad;

  if (nueva > stock) {
    return { lineas, agregado: false };
  }

  const lineasNuevas = existente
    ? lineas.map((linea) => (linea.codigo === codigo ? { ...linea, cantidad: nueva } : linea))
    : [...lineas, { codigo, cantidad }];

  return { lineas: lineasNuevas, agregado: true };
}

export function cambiarCantidadLinea(lineas, codigo, cantidad, stock) {
  const limitada = Math.min(cantidad, stock);

  if (!Number.isInteger(limitada) || limitada <= 0) {
    return quitarLinea(lineas, codigo);
  }

  return lineas.map((linea) =>
    linea.codigo === codigo ? { ...linea, cantidad: limitada } : linea
  );
}

export function sanitizarLineas(valor) {
  if (!Array.isArray(valor)) return [];

  return valor
    .filter(
      (linea) =>
        linea &&
        typeof linea.codigo === "string" &&
        Number.isInteger(linea.cantidad) &&
        linea.cantidad > 0
    )
    .map((linea) => ({ codigo: linea.codigo, cantidad: linea.cantidad }));
}
