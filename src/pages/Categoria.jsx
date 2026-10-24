import { useState } from "react";
import { Container, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import PlantillaPublica from "../components/templates/PlantillaPublica";
import GrillaProductos from "../components/organisms/GrillaProductos";
import MensajeNoEncontrado from "../components/organisms/MensajeNoEncontrado";
import Boton from "../components/atoms/Boton";
import { useTituloPagina } from "../hooks/useTituloPagina";
import { useCatalogo } from "../context/CatalogoContext";
import { useCarrito } from "../context/CarritoContext";
import { filtrarProductos } from "../utils/filtros";
import { conStockDisponible } from "../utils/carrito";

function Categoria() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { productos, categorias } = useCatalogo();
  const { agregar, items } = useCarrito();
  const [aviso, setAviso] = useState(null);

  const categoria = categorias.find((c) => c.id === id);

  useTituloPagina(categoria ? categoria.nombre : "Categoría no encontrada");

  function manejarAgregar(codigo) {
    const producto = productos.find((p) => p.codigo === codigo);
    const agregado = agregar(codigo, 1);

    setAviso(
      agregado
        ? { variante: "success", mensaje: `"${producto.nombre}" se agregó a tu solicitud.` }
        : { variante: "warning", mensaje: `No hay más stock disponible de "${producto.nombre}".` }
    );
  }

  if (!categoria) {
    return (
      <PlantillaPublica>
        <div className="py-5">
          <MensajeNoEncontrado
            codigo="404"
            titulo="Categoría no encontrada"
            descripcion="La categoría que buscas no existe."
            textoBoton="Ver categorías"
            onVolver={() => navigate("/categorias")}
          />
        </div>
      </PlantillaPublica>
    );
  }

  const delaCategoria = filtrarProductos(conStockDisponible(productos, items), { categoriaId: id });

  return (
    <PlantillaPublica>
      <Container className="py-4">
        <h1 className="mb-3">{categoria.nombre}</h1>
        <p className="text-muted">
          {delaCategoria.length} {delaCategoria.length === 1 ? "producto" : "productos"}
        </p>

        {aviso && (
          <Alert variant={aviso.variante} dismissible onClose={() => setAviso(null)}>
            {aviso.mensaje}
          </Alert>
        )}

        <GrillaProductos
          productos={delaCategoria}
          mensajeVacio="Esta categoría todavía no tiene productos."
          onAgregar={manejarAgregar}
          onVerDetalle={(codigo) => navigate(`/producto/${codigo}`)}
        />

        <div className="mt-4">
          <Boton
            texto="Ver todas las categorías"
            variante="outline-primary"
            onClick={() => navigate("/categorias")}
          />
        </div>
      </Container>
    </PlantillaPublica>
  );
}

export default Categoria;