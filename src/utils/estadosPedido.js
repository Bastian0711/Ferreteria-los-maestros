// Estados del pedido en el orden en que avanzan (igual que en ms-catalogo)
export const ESTADOS_PEDIDO = [
  "Pendiente",
  "En preparación",
  "Listo para retiro o despacho",
  "Entregado",
];
export const ESTADO_ANULADO = "Anulado";

// El estado al que puede avanzar un pedido, o null si ya terminó o está anulado
export function siguienteEstado(estado) {
  const indice = ESTADOS_PEDIDO.indexOf(estado);
  return indice >= 0 && indice < ESTADOS_PEDIDO.length - 1 ? ESTADOS_PEDIDO[indice + 1] : null;
}
