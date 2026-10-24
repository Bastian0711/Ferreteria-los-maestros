import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PlantillaPublica from "../components/templates/PlantillaPublica";
import ListaCategorias from "../components/organisms/ListaCategorias";
import { useTituloPagina } from "../hooks/useTituloPagina";
import { useCatalogo } from "../context/CatalogoContext";

function Categorias() {
  useTituloPagina("Categorías");
  const navigate = useNavigate();
  const { categorias } = useCatalogo();

  return (
    <PlantillaPublica>
      <Container className="py-4">
        <h1 className="mb-3">Categorías</h1>
        <p className="text-muted">Elige una categoría para ver sus productos.</p>
        <ListaCategorias
          categorias={categorias}
          onElegir={(id) => navigate(`/categoria/${id}`)}
        />
      </Container>
    </PlantillaPublica>
  );
}

export default Categorias;