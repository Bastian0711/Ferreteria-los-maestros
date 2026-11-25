import { useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import MenuAdmin from "../organisms/MenuAdmin";
import Boton from "../atoms/Boton";
import { useAuth } from "../../context/AuthContext";


// "roles" indica quién ve cada opción. El vendedor no administra productos.
const OPCIONES_MENU = [
  { ruta: "/admin", texto: "Resumen", exacta: true },
  { ruta: "/admin/productos", texto: "Productos", roles: ["admin"] },
  { ruta: "/admin/usuarios", texto: "Usuarios", roles: ["admin"] },
  { ruta: "/", texto: "Ver tienda" },
];

// Estructura del panel: barra superior, menú lateral (escritorio) o desplegable (móvil).
function PlantillaAdmin(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, cerrarSesion } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const rol = usuario ? usuario.rol : "";
  const opciones = OPCIONES_MENU.filter((opcion) => !opcion.roles || opcion.roles.includes(rol));

  function ir(ruta) {
    setMenuAbierto(false);
    navigate(ruta);
  }

  function salir() {
    cerrarSesion();
    navigate("/");
  }

  return (
    <div className="min-vh-100 bg-light">
      <header className="bg-dark text-white py-2 px-3 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-light btn-sm d-lg-none"
            aria-label="Abrir menú"
            onClick={() => setMenuAbierto(true)}
          >
            ☰
          </button>
          <span className="fw-bold">{rol === "vendedor" ? "Panel de ventas" : "Panel de administración"}</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <small className="d-none d-sm-inline">{usuario ? usuario.nombre : ""}</small>
          <Boton texto="Cerrar sesión" variante="outline-light" onClick={salir} />
        </div>
      </header>

      <div className="d-flex">
        <aside className="d-none d-lg-block bg-white border-end p-3" style={{ width: "240px" }}>
          <MenuAdmin opciones={opciones} rutaActual={location.pathname} onNavegar={ir} />
        </aside>
        <main className="flex-grow-1 p-3 p-md-4" style={{ minWidth: 0 }}>
          {props.children}
        </main>
      </div>

      <Offcanvas show={menuAbierto} onHide={() => setMenuAbierto(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menú</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <MenuAdmin opciones={opciones} rutaActual={location.pathname} onNavegar={ir} />
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default PlantillaAdmin;
