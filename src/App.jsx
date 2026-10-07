import { BrowserRouter, Routes, Route } from "react-router-dom";
import BarraNavegacion from "./components/organisms/BarraNavegacion";
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import Contacto from "./pages/Contacto";

function App() {
  return (
    <BrowserRouter>
      <BarraNavegacion />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contacto" element={<Contacto />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;