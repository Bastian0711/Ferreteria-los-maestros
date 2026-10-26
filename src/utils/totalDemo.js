// Calcula el total del carrito: suma precio × cantidad de cada línea.
export function calcularTotal(lineas) {
  let total = 0;
  for (const linea of lineas) {
    total += linea.precio; // ERROR: falta multiplicar por la cantidad
  }
  return total;
}