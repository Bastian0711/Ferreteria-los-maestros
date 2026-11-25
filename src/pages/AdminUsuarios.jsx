import { useEffect, useState } from "react";
import { Alert, Modal } from "react-bootstrap";
import PlantillaAdmin from "../components/templates/PlantillaAdmin";
import TablaUsuariosAdmin from "../components/organisms/TablaUsuariosAdmin";
import FormularioUsuario from "../components/organisms/FormularioUsuario";
import Boton from "../components/atoms/Boton";
import { useTituloPagina } from "../hooks/useTituloPagina";
import { useAuth } from "../context/AuthContext";
import {
  listarUsuarios,
  listarRoles,
  crearUsuario,
  actualizarUsuario,
  desactivarUsuario,
} from "../services/usuariosService";

// CRUD de usuarios (solo admin) contra ms-usuarios:
// listar (GET), crear (POST), editar rol y datos (PUT) y desactivar (DELETE).
function AdminUsuarios() {
  useTituloPagina("Administrar usuarios");
  const { usuario: actual } = useAuth();

  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState(null);
  const [formulario, setFormulario] = useState(null); // null | { usuario: null (nuevo) o el usuario a editar }
  const [errorFormulario, setErrorFormulario] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [porDesactivar, setPorDesactivar] = useState(null);

  useEffect(() => {
    let vigente = true;
    Promise.all([listarUsuarios(), listarRoles()])
      .then(([lista, listaRoles]) => {
        if (!vigente) return;
        setUsuarios(lista);
        setRoles(listaRoles);
      })
      .catch((e) => vigente && setAviso({ variante: "danger", mensaje: e.message }))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, []);

  function recargar() {
    return listarUsuarios()
      .then(setUsuarios)
      .catch((e) => setAviso({ variante: "danger", mensaje: e.message }));
  }

  function abrir(usuario) {
    setErrorFormulario("");
    setFormulario({ usuario });
  }

  async function guardar(datos) {
    const editando = formulario.usuario;
    setGuardando(true);
    try {
      if (editando) {
        await actualizarUsuario(editando.id, datos);
      } else {
        await crearUsuario(datos);
      }
      setFormulario(null);
      await recargar();
      setAviso({
        variante: "success",
        mensaje: `Usuario "${datos.nombre} ${datos.apellidos}" ${editando ? "actualizado" : "creado"}.`,
      });
    } catch (e) {
      // Por ejemplo, 409: ya existe una cuenta con ese correo. El formulario queda abierto.
      setErrorFormulario(e.message);
    } finally {
      setGuardando(false);
    }
  }

  async function confirmarDesactivacion() {
    const usuario = porDesactivar;
    setPorDesactivar(null);
    try {
      await desactivarUsuario(usuario.id);
      await recargar();
      setAviso({ variante: "success", mensaje: `Se desactivó la cuenta de ${usuario.correo}.` });
    } catch (e) {
      setAviso({ variante: "danger", mensaje: e.message });
    }
  }

  async function activar(usuario) {
    try {
      await actualizarUsuario(usuario.id, { ...usuario, activo: true });
      await recargar();
      setAviso({ variante: "success", mensaje: `Se activó la cuenta de ${usuario.correo}.` });
    } catch (e) {
      setAviso({ variante: "danger", mensaje: e.message });
    }
  }

  return (
    <PlantillaAdmin>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Usuarios</h1>
        <Boton texto="Nuevo usuario" onClick={() => abrir(null)} />
      </div>

      {aviso && (
        <Alert variant={aviso.variante} dismissible onClose={() => setAviso(null)}>
          {aviso.mensaje}
        </Alert>
      )}

      {cargando ? (
        <p className="text-muted">Cargando usuarios...</p>
      ) : (
        <TablaUsuariosAdmin
          usuarios={usuarios}
          idActual={actual ? actual.id : null}
          onEditar={abrir}
          onDesactivar={setPorDesactivar}
          onActivar={activar}
        />
      )}

      <Modal show={formulario !== null} onHide={() => setFormulario(null)} size="lg" animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>{formulario && formulario.usuario ? "Editar usuario" : "Nuevo usuario"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formulario && (
            <FormularioUsuario
              usuarioInicial={formulario.usuario || undefined}
              roles={roles}
              error={errorFormulario}
              guardando={guardando}
              onGuardar={guardar}
              onCancelar={() => setFormulario(null)}
            />
          )}
        </Modal.Body>
      </Modal>

      <Modal show={porDesactivar !== null} onHide={() => setPorDesactivar(null)} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Desactivar usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {porDesactivar &&
            `¿Desactivar la cuenta de ${porDesactivar.correo}? Ya no podrá iniciar sesión, pero sus pedidos se conservan.`}
        </Modal.Body>
        <Modal.Footer>
          <Boton texto="Cancelar" variante="outline-secondary" onClick={() => setPorDesactivar(null)} />
          <Boton texto="Desactivar" variante="danger" onClick={confirmarDesactivacion} />
        </Modal.Footer>
      </Modal>
    </PlantillaAdmin>
  );
}

export default AdminUsuarios;
