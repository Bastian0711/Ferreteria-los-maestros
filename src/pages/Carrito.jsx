import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PlantillaPublica from "../components/templates/PlantillaPublica";
import ListaCarrito from "../components/organisms/ListaCarrito";
import Boton from "../components/atoms/Boton";
import { useTituloPagina } from "../hooks/useTituloPagina";
import { useCarrito } from "../context/CarritoContext";

function Carrito() {
  useTituloPagina("Solicitud en curso");
  const navigate = useNavigate();
  const { items, total, cantidadTotal, quitar, cambiarCantidad, limpiar } = useCarrito();

  return (
    <PlantillaPublica>
      <Container className="py-4">
        <h1 className="mb-4">Solicitud en curso</h1>

        {items.length === 0 ? (
          <div className="text-center py-5">
            <p className="lead">Tu solicitud está vacía.</p>
            <Boton texto="Ir al catálogo" onClick={() => navigate("/catalogo")} />
          </div>
        ) : (
          <ListaCarrito
            items={items}
            total={total}
            cantidadTotal={cantidadTotal}
            onCambiarCantidad={cambiarCantidad}
            onQuitar={quitar}
            onLimpiar={limpiar}
            onConfirmar={() => navigate("/checkout")}
          />
        )}
      </Container>
    </PlantillaPublica>
  );
}

export default Carrito;
