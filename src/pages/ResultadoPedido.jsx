import { useEffect, useState } from "react";
import { Alert, Container } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PlantillaPublica from "../components/templates/PlantillaPublica";
import ResumenPedido from "../components/organisms/ResumenPedido";
import MensajeResultado from "../components/organisms/MensajeResultado";
import Boton from "../components/atoms/Boton";
import { useTituloPagina } from "../hooks/useTituloPagina";
import { useAuth } from "../context/AuthContext";
import { useCatalogo } from "../context/CatalogoContext";
import { obtenerPedido, anularPedido } from "../services/pedidosService";

const MOTIVO_POR_DEFECTO = "No pudimos registrar tu solicitud. Inténtalo nuevamente.";

// /pedido/:numero muestra el comprobante (lo pide a ms-catalogo). /pedido/error muestra el aviso de fallo.
function ResultadoPedido() {
  const { numero } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { recargar } = useCatalogo();

  const esError = numero === "error";
  const debeCargar = !esError && Boolean(usuario);
  const [resultado, setResultado] = useState({ cargando: debeCargar, pedido: null });
  const [aviso, setAviso] = useState(null);

  // La privacidad la controla el backend: si el pedido es de otra persona responde 403
  useEffect(() => {
    if (!debeCargar) return undefined;
    let vigente = true;
    obtenerPedido(numero)
      .then((pedido) => vigente && setResultado({ cargando: false, pedido }))
      .catch(() => vigente && setResultado({ cargando: false, pedido: null }));
    return () => {
      vigente = false;
    };
  }, [numero, debeCargar]);

  const pedido = resultado.pedido;
  let titulo = "Solicitud no encontrada";
  if (esError) titulo = "Error en la solicitud";
  if (resultado.cargando) titulo = "Cargando solicitud";
  if (pedido) titulo = `Solicitud ${pedido.numero}`;
  useTituloPagina(titulo);

  async function anular() {
    try {
      const anulado = await anularPedido(pedido.numero);
      setResultado({ cargando: false, pedido: anulado });
      setAviso({ variante: "success", mensaje: "Anulaste la solicitud. El stock volvió al catálogo." });
      recargar();
    } catch (error) {
      setAviso({ variante: "danger", mensaje: error.message });
    }
  }

  if (esError) {
    return (
      <PlantillaPublica>
        <div className="py-5">
          <MensajeResultado
            tipo="error"
            titulo="No pudimos registrar tu solicitud"
            descripcion={(location.state && location.state.motivo) || MOTIVO_POR_DEFECTO}
            textoBoton="Revisar mi solicitud"
            onAccion={() => navigate("/carrito")}
          />
        </div>
      </PlantillaPublica>
    );
  }

  if (resultado.cargando) {
    return (
      <PlantillaPublica>
        <p className="text-center text-muted py-5">Cargando solicitud...</p>
      </PlantillaPublica>
    );
  }

  if (!pedido) {
    return (
      <PlantillaPublica>
        <div className="py-5">
          <MensajeResultado
            tipo="error"
            titulo="Solicitud no encontrada"
            descripcion="La solicitud no existe, no tienes permiso para verla o tu sesión expiró."
            textoBoton="Ir al catálogo"
            onAccion={() => navigate("/catalogo")}
          />
        </div>
      </PlantillaPublica>
    );
  }

  // El backend no guarda el nombre del cliente en el pedido: si es propio, se muestra el de la sesión
  const esPropio = usuario && usuario.id === pedido.usuarioId;
  const cliente = esPropio
    ? { nombre: usuario.nombre, apellidos: usuario.apellidos, correo: usuario.correo }
    : { nombre: `Cliente N° ${pedido.usuarioId}`, apellidos: "", correo: "" };

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

        {aviso && (
          <Alert variant={aviso.variante} dismissible onClose={() => setAviso(null)}>
            {aviso.mensaje}
          </Alert>
        )}

        <ResumenPedido pedido={{ ...pedido, cliente }} />

        <div className="d-flex flex-wrap gap-2 justify-content-center mt-4">
          <Boton texto="Seguir comprando" onClick={() => navigate("/catalogo")} />
          <Boton texto="Volver al inicio" variante="outline-secondary" onClick={() => navigate("/")} />
          {esPropio && pedido.estado === "Pendiente" && (
            <Boton texto="Anular solicitud" variante="outline-danger" onClick={anular} />
          )}
        </div>
      </Container>
    </PlantillaPublica>
  );
}

export default ResultadoPedido;
