import FormularioLogin from "../components/organisms/FormularioLogin";
import { useTituloPagina } from "../hooks/useTituloPagina";
import PlantillaPublica from "../components/templates/PlantillaPublica";

function Login() {
  useTituloPagina("Iniciar sesión");

  function manejarLogin(datos) {
    console.log("Datos del login:", datos);
    alert(`Bienvenido, ${datos.correo}`);
  }

  return (
    <PlantillaPublica>
      <div className="py-5">
        <FormularioLogin onLogin={manejarLogin} />
      </div>
    </PlantillaPublica>
  );
}

export default Login;