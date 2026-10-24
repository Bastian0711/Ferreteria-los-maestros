import { Container, Navbar, Nav } from "react-bootstrap";
import InsigniaCarrito from "../atoms/InsigniaCarrito";

function BarraNavegacion(props) {
  const usuario = props.usuario;
  const esAdmin = usuario?.rol === "admin";

  function ir(evento, ruta) {
    evento.preventDefault();
    props.onNavegar(ruta);
  }

  function salir(evento) {
    evento.preventDefault();
    props.onCerrarSesion?.();
    props.onNavegar("/");
  }

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="md">
      <Container>
        <Navbar.Brand href="/" onClick={(e) => ir(e, "/")}>
          Ferretería Los Maestros
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="ms-auto">
            <Nav.Link href="/" onClick={(e) => ir(e, "/")}>Inicio</Nav.Link>
            <Nav.Link href="/catalogo" onClick={(e) => ir(e, "/catalogo")}>Catálogo</Nav.Link>
            <Nav.Link href="/categorias" onClick={(e) => ir(e, "/categorias")}>Categorías</Nav.Link>
            <Nav.Link href="/ofertas" onClick={(e) => ir(e, "/ofertas")}>Ofertas</Nav.Link>
            <Nav.Link href="/contacto" onClick={(e) => ir(e, "/contacto")}>Contáctanos</Nav.Link>
            <Nav.Link href="/carrito" onClick={(e) => ir(e, "/carrito")}>
              Carrito
              <InsigniaCarrito cantidad={props.cantidadCarrito} />
            </Nav.Link>

            {esAdmin && (
              <Nav.Link href="/admin" onClick={(e) => ir(e, "/admin")}>
                Panel admin
              </Nav.Link>
            )}

            {usuario ? (
              <Nav.Link href="/" onClick={salir}>Cerrar sesión</Nav.Link>
            ) : (
              <>
                <Nav.Link href="/login" onClick={(e) => ir(e, "/login")}>Iniciar sesión</Nav.Link>
                <Nav.Link href="/registro" onClick={(e) => ir(e, "/registro")}>Registro</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BarraNavegacion;
