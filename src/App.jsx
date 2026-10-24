import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import Contacto from "./pages/Contacto";
import NoEncontrado from "./pages/NoEncontrado";
import Catalogo from "./pages/Catalogo";
import DetalleProducto from "./pages/DetalleProducto";
import Carrito from "./pages/Carrito";
import Checkout from "./pages/Checkout";
import ResultadoPedido from "./pages/ResultadoPedido";
import AdminProductos from "./pages/AdminProductos";
import RutaProtegida from "./routes/RutaProtegida";
import Registro from "./pages/Registro";
import AdminDashboard from "./pages/AdminDashboard";
import Ofertas from "./pages/Ofertas";
import Categorias from "./pages/Categorias";
import Categoria from "./pages/Categoria";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/categoria/:id" element={<Categoria />} />
        <Route path="/producto/:codigo" element={<DetalleProducto />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pedido/:numero" element={<ResultadoPedido />} />
        <Route path="/admin/productos" element={<RutaProtegida rolRequerido="admin"><AdminProductos /></RutaProtegida>} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/admin" element={<RutaProtegida rolRequerido="admin"><AdminDashboard /></RutaProtegida>} />
        <Route path="*" element={<NoEncontrado />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;