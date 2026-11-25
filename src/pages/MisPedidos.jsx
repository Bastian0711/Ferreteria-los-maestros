import { useEffect, useState } from "react";
import { Alert, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PlantillaPublica from "../components/templates/PlantillaPublica";
import UltimosPedidos from "../components/organisms/UltimosPedidos";
import TarjetaEstadistica from "../components/molecules/TarjetaEstadistica";
import Precio from "../components/atoms/Precio";
import { useTituloPagina } from "../hooks/useTituloPagina";
import { useAuth } from "../context/AuthContext";
import { listarPedidos, obtenerSaldo } from "../services/pedidosService";

// Historial de solicitudes del cliente. El contratista ve además su saldo de cuenta corriente.
// El backend solo devuelve los pedidos del dueño del token.
function MisPedidos() {
  useTituloPagina("Mis solicitudes");
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const esContratista = Boolean(usuario && usuario.rol === "contratista");

  const [pedidos, setPedidos] = useState([]);
  const [saldo, setSaldo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let vigente = true;
    Promise.all([listarPedidos(), esContratista ? obtenerSaldo() : Promise.resolve(null)])
      .then(([lista, cuenta]) => {
        if (!vigente) return;
        setPedidos(lista);
        setSaldo(cuenta ? cuenta.saldo : null);
      })
      .catch((e) => vigente && setError(e.message))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, [esContratista]);

  return (
    <PlantillaPublica>
      <Container className="py-4">
        <h1 className="mb-4">Mis solicitudes</h1>

        {error && <Alert variant="danger">{error}</Alert>}

        {esContratista && saldo !== null && (
          <div className="mb-4" style={{ maxWidth: "320px" }}>
            <TarjetaEstadistica
              titulo="Saldo de cuenta corriente"
              valor={<Precio valor={saldo} className="" />}
              detalle="Se paga a fin de mes"
              variante="warning"
            />
          </div>
        )}

        {cargando ? (
          <p className="text-muted">Cargando tus solicitudes...</p>
        ) : (
          <UltimosPedidos pedidos={pedidos} onVer={(numero) => navigate(`/pedido/${numero}`)} />
        )}
      </Container>
    </PlantillaPublica>
  );
}

export default MisPedidos;
