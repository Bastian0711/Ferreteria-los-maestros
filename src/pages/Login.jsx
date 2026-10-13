import FormularioLogin from "../components/organisms/FormularioLogin";
import { useTituloPagina } from "../hooks/useTituloPagina";

function Login() {
  useTituloPagina("Iniciar sesión");
  
  function manejarLogin(datos) {
    console.log("Datos del login:", datos);
    alert(`Bienvenido, ${datos.correo}`);
  }

  return (
    <div className="py-5">
      <FormularioLogin onLogin={manejarLogin} />
    </div>
  );
}

export default Login;