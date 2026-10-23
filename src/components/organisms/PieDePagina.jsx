function PieDePagina(props) {
    const anio = props.anio || new Date().getFullYear();

    return (
        <footer className="bg-dark text-white-50 py-4 mt-5">
            <div className="container text-center small">
                <p className="mb-1">{`© ${anio} Ferretería Los Maestros`}</p>
                <p className="mb-0">Atención en La Serena, Región de Coquimbo</p>
            </div>
        </footer>
    );
}

export default PieDePagina;
