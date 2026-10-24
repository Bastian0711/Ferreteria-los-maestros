import { useState } from "react";
import { Container, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import PlantillaPublica from "../components/templates/PlantillaPublica";
import ListaCategorias from "../components/organisms/ListaCategorias";
import SeccionProductos from "../components/organisms/SeccionProductos";
import { useTituloPagina } from "../hooks/useTituloPagina";
import { useAuth } from "../context/AuthContext";
import { useCatalogo } from "../context/CatalogoContext";
import { useCarrito } from "../context/CarritoContext";
import { estaEnOferta } from "../utils/precios";
import { conStockDisponible } from "../utils/carrito";

const CANTIDAD_POR_BLOQUE = 3;

function Inicio() {
  useTituloPagina("Inicio");
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { productos, categorias } = useCatalogo();
  const { agregar, items } = useCarrito();
  const [aviso, setAviso] = useState(null);

  const disponibles = conStockDisponible(productos, items);
  const ofertas = disponibles.filter(estaEnOferta).slice(0, CANTIDAD_POR_BLOQUE);
  const destacados = disponibles.filter((p) => p.destacado).slice(0, CANTIDAD_POR_BLOQUE);

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
      <Container className="py-5">
        <div className="text-center mb-5">
          <h1 className="mb-3">Ferretería Los Maestros</h1>
          <p className="lead mb-4">
            Materiales de construcción, herramientas y ferretería general.
            22 años atendiendo a La Serena.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <Link to="/catalogo" className="btn btn-primary">
              Ver catálogo
            </Link>
            {!usuario && (
              <Link to="/login" className="btn btn-outline-primary">
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>

        {aviso && (
          <Alert variant={aviso.variante} dismissible onClose={() => setAviso(null)}>
            {aviso.mensaje}
          </Alert>
        )}

        <section className="py-4">
          <h2 className="h3 mb-3">Categorías</h2>
          <ListaCategorias
            categorias={categorias}
            onElegir={(id) => navigate(`/catalogo?categoria=${id}`)}
          />
        </section>

        <SeccionProductos
          titulo="Ofertas"
          productos={ofertas}
          onAgregar={manejarAgregar}
          onVerDetalle={(codigo) => navigate(`/producto/${codigo}`)}
          onVerTodos={() => navigate("/catalogo")}
        />
        <SeccionProductos
          titulo="Productos destacados"
          productos={destacados}
          onAgregar={manejarAgregar}
          onVerDetalle={(codigo) => navigate(`/producto/${codigo}`)}
        />
      </Container>
    </PlantillaPublica>
  );
}

export default Inicio;
