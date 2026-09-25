import FormularioLogin from "../components/organisms/FormularioLogin";

function Login() {
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