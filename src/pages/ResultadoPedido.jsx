import { Container } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PlantillaPublica from "../components/templates/PlantillaPublica";
import ResumenPedido from "../components/organisms/ResumenPedido";
import MensajeResultado from "../components/organisms/MensajeResultado";
import Boton from "../components/atoms/Boton";
import { useTituloPagina } from "../hooks/useTituloPagina";
import { useAuth } from "../context/AuthContext";
import { obtenerPedido } from "../services/pedidosService";

const MOTIVO_POR_DEFECTO = "No pudimos registrar tu solicitud. Inténtalo nuevamente.";

// /pedido/:numero muestra el comprobante. /pedido/error muestra el aviso de fallo.
function ResultadoPedido() {
  const { numero } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const esError = numero === "error";
  const pedido = esError ? undefined : obtenerPedido(numero);

  // Privacidad: un pedido de un cliente registrado solo lo ve ese cliente o un administrador.
  // Los pedidos hechos sin sesión (usuarioId nulo) se pueden ver con su número.
  const puedeVer =
    pedido &&
    (pedido.usuarioId === null ||
      (usuario && (usuario.id === pedido.usuarioId || usuario.rol === "admin")));

  let titulo = "Solicitud no encontrada";
  if (esError) titulo = "Error en la solicitud";
  if (puedeVer) titulo = `Solicitud ${pedido.numero}`;
  useTituloPagina(titulo);

  if (esError) {
    return (
      <PlantillaPublica>
        <div className="py-5">
          <MensajeResultado
            tipo="error"
            titulo="No pudimos registrar tu solicitud"
            descripcion={(location.state && location.state.motivo) || MOTIVO_POR_DEFECTO}
            textoBoton="Reintentar"
            onAccion={() => navigate("/checkout")}
          />
        </div>
      </PlantillaPublica>
    );
  }

  if (!puedeVer) {
    return (
      <PlantillaPublica>
        <div className="py-5">
          <MensajeResultado
            tipo="error"
            titulo="Solicitud no encontrada"
            descripcion="La solicitud no existe o no tienes permiso para verla."
            textoBoton="Ir al catálogo"
            onAccion={() => navigate("/catalogo")}
          />
        </div>
      </PlantillaPublica>
    );
  }

  return (
    <PlantillaPublica>
      <Container className="py-4">
        <div className="text-center mb-4">
          <p className="display-4 text-success mb-0" aria-hidden="true">✓</p>
          <h1 className="h3">¡Solicitud registrada!</h1>
          <p className="lead mb-0">
            Tu número de solicitud es <strong>{pedido.numero}</strong>
          </p>
        </div>

        <ResumenPedido pedido={pedido} />

        <div className="d-flex flex-wrap gap-2 justify-content-center mt-4">
          <Boton texto="Seguir comprando" onClick={() => navigate("/catalogo")} />
          <Boton texto="Volver al inicio" variante="outline-secondary" onClick={() => navigate("/")} />
        </div>
      </Container>
    </PlantillaPublica>
  );
}

export default ResultadoPedido;
