//quita las tildes en el filtro
function normalizar(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

// Filtra por texto en el nombre o la marca
export function filtrarProductos(productos, { texto = "", categoriaId = "" } = {}) {
  const buscado = normalizar(texto);

  return productos.filter((producto) => {
    const coincideCategoria = !categoriaId || producto.categoriaId === categoriaId;
    const coincideTexto =
      !buscado ||
      normalizar(producto.nombre).includes(buscado) ||
      normalizar(producto.marca).includes(buscado);

    return coincideCategoria && coincideTexto;
  });
}
