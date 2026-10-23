import { useState } from "react";
import { Alert, Modal } from "react-bootstrap";
import PlantillaAdmin from "../components/templates/PlantillaAdmin";
import TablaProductosAdmin from "../components/organisms/TablaProductosAdmin";
import FormularioProducto from "../components/organisms/FormularioProducto";
import Boton from "../components/atoms/Boton";
import { useTituloPagina } from "../hooks/useTituloPagina";
import { useCatalogo } from "../context/CatalogoContext";
import {
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../services/productosService";

// CRUD de productos. La tabla se actualiza sola porque CatalogoContext escucha los cambios.
function AdminProductos() {
  useTituloPagina("Administrar productos");
  const { productos, categorias } = useCatalogo();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(null); // producto que se edita; null = uno nuevo
  const [errorFormulario, setErrorFormulario] = useState("");
  const [porEliminar, setPorEliminar] = useState(null);
  const [aviso, setAviso] = useState(null);

  function abrirNuevo() {
    setEditando(null);
    setErrorFormulario("");
    setMostrarFormulario(true);
  }

  function abrirEditar(codigo) {
    setEditando(productos.find((p) => p.codigo === codigo) || null);
    setErrorFormulario("");
    setMostrarFormulario(true);
  }

  function guardar(datos) {
    try {
      if (editando) {
        actualizarProducto(editando.codigo, datos);
      } else {
        crearProducto(datos);
      }
      setMostrarFormulario(false);
      setAviso({
        variante: "success",
        mensaje: `Producto "${datos.nombre}" ${editando ? "actualizado" : "creado"}.`,
      });
    } catch (error) {
      // Por ejemplo: código repetido. El formulario queda abierto mostrando el motivo.
      setErrorFormulario(error.message);
    }
  }

  function pedirConfirmacion(codigo) {
    setPorEliminar(productos.find((p) => p.codigo === codigo) || null);
  }

  function confirmarEliminacion() {
    eliminarProducto(porEliminar.codigo);
    setAviso({ variante: "success", mensaje: `Producto "${porEliminar.nombre}" eliminado.` });
    setPorEliminar(null);
  }

  return (
    <PlantillaAdmin>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Productos</h1>
        <Boton texto="Nuevo producto" onClick={abrirNuevo} />
      </div>

      {aviso && (
        <Alert variant={aviso.variante} dismissible onClose={() => setAviso(null)}>
          {aviso.mensaje}
        </Alert>
      )}

      <TablaProductosAdmin
        productos={productos}
        categorias={categorias}
        onEditar={abrirEditar}
        onEliminar={pedirConfirmacion}
      />

      <Modal
        show={mostrarFormulario}
        onHide={() => setMostrarFormulario(false)}
        size="lg"
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{editando ? "Editar producto" : "Nuevo producto"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormularioProducto
            productoInicial={editando || undefined}
            categorias={categorias}
            error={errorFormulario}
            onGuardar={guardar}
            onCancelar={() => setMostrarFormulario(false)}
          />
        </Modal.Body>
      </Modal>

      <Modal show={porEliminar !== null} onHide={() => setPorEliminar(null)} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {porEliminar &&
            `¿Seguro que quieres eliminar "${porEliminar.nombre}"? Esta acción no se puede deshacer.`}
        </Modal.Body>
        <Modal.Footer>
          <Boton texto="Cancelar" variante="outline-secondary" onClick={() => setPorEliminar(null)} />
          <Boton texto="Eliminar" variante="danger" onClick={confirmarEliminacion} />
        </Modal.Footer>
      </Modal>
    </PlantillaAdmin>
  );
}

export default AdminProductos;
