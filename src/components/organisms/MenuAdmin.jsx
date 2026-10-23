function MenuAdmin(props) {
    const opciones = props.opciones || [];
    const rutaActual = props.rutaActual || "";

    function estaActiva(opcion) {
        if (opcion.exacta) return rutaActual === opcion.ruta;
        return rutaActual === opcion.ruta || rutaActual.startsWith(`${opcion.ruta}/`);
    }

    return (
        <nav aria-label="Menú de administración">
            <ul className="nav nav-pills flex-column gap-1">
                {opciones.map((opcion) => (
                    <li className="nav-item" key={opcion.ruta}>
                        <a
                            href={opcion.ruta}
                            className={`nav-link ${estaActiva(opcion) ? "active" : ""}`}
                            aria-current={estaActiva(opcion) ? "page" : undefined}
                            onClick={(e) => {
                                e.preventDefault();
                                props.onNavegar(opcion.ruta);
                            }}
                        >
                            {opcion.texto}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default MenuAdmin;
