import { useState } from "react";
import { Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PlantillaPublica from "../components/templates/PlantillaPublica";
import GrillaProductos from "../components/organisms/GrillaProductos";
import { useTituloPagina } from "../hooks/useTituloPagina";
import { useCatalogo } from "../context/CatalogoContext";
import { useCarrito } from "../context/CarritoContext";
import { estaEnOferta } from "../utils/precios";
import { conStockDisponible } from "../utils/carrito";

function Ofertas() {
  useTituloPagina("Ofertas");
  const navigate = useNavigate();
  const { productos } = useCatalogo();
  const { agregar, items } = useCarrito();
  const [aviso, setAviso] = useState(null);

  const ofertas = conStockDisponible(productos, items).filter(estaEnOferta);

  function manejarAgregar(codigo) {
    const producto = productos.find((p) => p.codigo === codigo);
    const agregado = agregar(codigo, 1);

    setAviso(
      agregado
        ? { variante: "success", mensaje: `"${producto.nombre}" se agregó a tu solicitud.` }
        : { variante: "warning", mensaje: `No hay más stock disponible de "${producto.nombre}".` }
    );
  }

  return (
    <PlantillaPublica>
      <Container className="py-4">
        <h1 className="mb-3">Ofertas</h1>
        <p className="text-muted">
          {ofertas.length} {ofertas.length === 1 ? "producto en oferta" : "productos en oferta"}
        </p>

        {aviso && (
          <Alert variant={aviso.variante} dismissible onClose={() => setAviso(null)}>
            {aviso.mensaje}
          </Alert>
        )}

        <GrillaProductos
          productos={ofertas}
          mensajeVacio="Por ahora no hay productos en oferta."
          onAgregar={manejarAgregar}
          onVerDetalle={(codigo) => navigate(`/producto/${codigo}`)}
        />
      </Container>
    </PlantillaPublica>
  );
}

export default Ofertas;