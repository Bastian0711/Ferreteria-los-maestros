import { useState } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import PlantillaPublica from "../components/templates/PlantillaPublica";
import BuscadorProductos from "../components/molecules/BuscadorProductos";
import FiltroCategoria from "../components/molecules/FiltroCategoria";
import GrillaProductos from "../components/organisms/GrillaProductos";
import Boton from "../components/atoms/Boton";
import { useTituloPagina } from "../hooks/useTituloPagina";
import { useCatalogo } from "../context/CatalogoContext";
import { useCarrito } from "../context/CarritoContext";
import { filtrarProductos } from "../utils/filtros";

function Catalogo() {
  useTituloPagina("Catálogo");
  const navigate = useNavigate();
  const [parametros] = useSearchParams();
  const { productos, categorias } = useCatalogo();
  const { agregar } = useCarrito();
  const [texto, setTexto] = useState("");
  const [categoriaId, setCategoriaId] = useState(parametros.get("categoria") || "");
  const [aviso, setAviso] = useState(null);

  const filtrados = filtrarProductos(productos, { texto, categoriaId });
  const hayFiltros = texto !== "" || categoriaId !== "";

  function limpiarFiltros() {
    setTexto("");
    setCategoriaId("");
  }

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
        <h1 className="mb-3">Catálogo</h1>

        <Row className="g-3 align-items-end">
          <Col xs={12} md={6}>
            <BuscadorProductos value={texto} onChange={(e) => setTexto(e.target.value)} />
          </Col>
          <Col xs={12} md={4}>
            <FiltroCategoria
              categorias={categorias}
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
            />
          </Col>
          <Col xs={12} md={2}>
            <div className="d-grid mb-3">
              <Boton
                texto="Limpiar filtros"
                variante="outline-secondary"
                disabled={!hayFiltros}
                onClick={limpiarFiltros}
              />
            </div>
          </Col>
        </Row>

        {aviso && (
          <Alert variant={aviso.variante} dismissible onClose={() => setAviso(null)}>
            {aviso.mensaje}
          </Alert>
        )}

        <p className="text-muted">
          {filtrados.length} {filtrados.length === 1 ? "producto" : "productos"}
        </p>

        <GrillaProductos
          productos={filtrados}
          onAgregar={manejarAgregar}
          onVerDetalle={(codigo) => navigate(`/producto/${codigo}`)}
        />
      </Container>
    </PlantillaPublica>
  );
}

export default Catalogo;
