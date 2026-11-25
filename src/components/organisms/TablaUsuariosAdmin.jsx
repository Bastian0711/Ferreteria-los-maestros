import Boton from "../atoms/Boton";

// Tabla de usuarios del panel. No ofrece desactivar la propia cuenta (el backend también lo impide).
function TablaUsuariosAdmin(props) {
  const usuarios = props.usuarios || [];

  if (usuarios.length === 0) {
    return <p className="text-muted">No hay usuarios que mostrar.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle bg-white">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => {
            const esPropio = usuario.id === props.idActual;
            return (
              <tr key={usuario.id} className={usuario.activo ? "" : "text-muted"}>
                <td>{usuario.id}</td>
                <td>
                  {usuario.nombre} {usuario.apellidos}
                  {esPropio && <span className="badge bg-secondary ms-2">tú</span>}
                </td>
                <td>{usuario.correo}</td>
                <td className="text-capitalize">{usuario.rol}</td>
                <td>
                  <span className={`badge ${usuario.activo ? "bg-success" : "bg-secondary"}`}>
                    {usuario.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="text-end">
                  <div className="d-inline-flex gap-2">
                    <Boton
                      texto="Editar"
                      variante="outline-primary btn-sm"
                      onClick={() => props.onEditar(usuario)}
                    />
                    {!esPropio && usuario.activo && (
                      <Boton
                        texto="Desactivar"
                        variante="outline-danger btn-sm"
                        onClick={() => props.onDesactivar(usuario)}
                      />
                    )}
                    {!usuario.activo && (
                      <Boton
                        texto="Activar"
                        variante="outline-success btn-sm"
                        onClick={() => props.onActivar(usuario)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TablaUsuariosAdmin;
