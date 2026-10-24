import { useState } from "react";
import { Container, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import PlantillaPublica from "../components/templates/PlantillaPublica";
import FichaProducto from "../components/organisms/FichaProducto";
import MensajeNoEncontrado from "../components/organisms/MensajeNoEncontrado";
import { useTituloPagina } from "../hooks/useTituloPagina";
import { useCatalogo } from "../context/CatalogoContext";
import { useCarrito } from "../context/CarritoContext";
import { conStockDisponible } from "../utils/carrito";

function DetalleProducto() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const { productos, categorias } = useCatalogo();
  const { agregar, items } = useCarrito();
  const [aviso, setAviso] = useState(null);

  const producto = productos.find((p) => p.codigo === codigo);
  const categoria = producto && categorias.find((c) => c.id === producto.categoriaId);

  useTituloPagina(producto ? producto.nombre : "Producto no encontrado");

  function manejarAgregar(cantidad) {
    const agregado = agregar(producto.codigo, cantidad);

    setAviso(
      agregado
        ? { variante: "success", mensaje: `Agregaste ${cantidad} a tu solicitud.` }
        : { variante: "warning", mensaje: "No hay stock suficiente para esa cantidad." }
    );
  }

  if (!producto) {
    return (
      <PlantillaPublica>
        <div className="py-5">
          <MensajeNoEncontrado
            codigo="404"
            titulo="Producto no encontrado"
            descripcion="El producto que buscas no existe o fue retirado del catálogo."
            textoBoton="Volver al catálogo"
            onVolver={() => navigate("/catalogo")}
          />
        </div>
      </PlantillaPublica>
    );
  }

  return (
    <PlantillaPublica>
      <Container className="py-4">
        {aviso && (
          <Alert variant={aviso.variante} dismissible onClose={() => setAviso(null)}>
            {aviso.mensaje}
          </Alert>
        )}
        <FichaProducto
          producto={conStockDisponible([producto], items)[0]}
          categoriaNombre={categoria ? categoria.nombre : ""}
          onAgregar={manejarAgregar}
          onVolver={() => navigate("/catalogo")}
        />
      </Container>
    </PlantillaPublica>
  );
}

export default DetalleProducto;
