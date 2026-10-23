import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CatalogoProvider } from './context/CatalogoContext.jsx'
import { CarritoProvider } from './context/CarritoContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CatalogoProvider>
        <CarritoProvider>
          <App />
        </CarritoProvider>
      </CatalogoProvider>
    </AuthProvider>
  </StrictMode>,
)