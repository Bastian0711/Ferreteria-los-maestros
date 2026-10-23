import { useNavigate } from "react-router-dom";
import BarraNavegacion from "../organisms/BarraNavegacion";
import { useAuth } from "../../context/AuthContext";
import { useCarrito } from "../../context/CarritoContext";

function PlantillaPublica(props) {
  const navigate = useNavigate();
  const { usuario, cerrarSesion } = useAuth();
  const { cantidadTotal } = useCarrito();
  
  return (
    <>
      <BarraNavegacion
        onNavegar={navigate}
        usuario={usuario}
        cantidadCarrito={props.cantidadCarrito}
        onCerrarSesion={cerrarSesion}
      />
      <main>{props.children}</main>
    </>
  );
}

export default PlantillaPublica;