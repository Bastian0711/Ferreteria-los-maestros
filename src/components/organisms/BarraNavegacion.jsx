import { Container, Navbar, Nav } from "react-bootstrap";

function BarraNavegacion(props) {
  function ir(evento, ruta) {
    evento.preventDefault();
    props.onNavegar(ruta);
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
            <Nav.Link href="/contacto" onClick={(e) => ir(e, "/contacto")}>Contáctanos</Nav.Link>
            <Nav.Link href="/login" onClick={(e) => ir(e, "/login")}>Iniciar sesión</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BarraNavegacion;