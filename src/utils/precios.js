export function estaEnOferta(producto) {
  return Boolean(producto.oferta && producto.precioOferta);
}

export function precioFinal(producto) {
  return estaEnOferta(producto) ? producto.precioOferta : producto.precioVenta;
}
