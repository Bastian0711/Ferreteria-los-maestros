import { useNavigate } from "react-router-dom";
import BarraNavegacion from "../organisms/BarraNavegacion";
import PieDePagina from "../organisms/PieDePagina";
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
        cantidadCarrito={cantidadTotal}
        onCerrarSesion={cerrarSesion}
      />
      <main>{props.children}</main>
      <PieDePagina />
    </>
  );
}

export default PlantillaPublica;