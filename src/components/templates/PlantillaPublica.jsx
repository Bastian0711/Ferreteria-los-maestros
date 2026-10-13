import { useNavigate } from "react-router-dom";
import BarraNavegacion from "../organisms/BarraNavegacion";

function PlantillaPublica(props) {
  const navigate = useNavigate();

  return (
    <>
      <BarraNavegacion onNavegar={navigate} />
      <main>{props.children}</main>
    </>
  );
}

export default PlantillaPublica;