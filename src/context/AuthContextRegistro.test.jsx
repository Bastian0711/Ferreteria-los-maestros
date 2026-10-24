import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "./AuthContext";
import { reiniciarBase } from "../data/baseDatos";

function Panel() {
  const { usuario, registrar } = useAuth();
  const [mensaje, setMensaje] = useState("");

  function intentar(correo) {
    try {
      registrar({ nombre: "Ana", apellidos: "Pérez", correo, contrasena: "Nueva123!" });
    } catch (e) {
      setMensaje(e.message);
    }
  }

  return (
    <div>
      <p data-testid="correo">{usuario ? usuario.correo : "sin sesión"}</p>
      <p data-testid="mensaje">{mensaje}</p>
      <button onClick={() => intentar("ana@correo.cl")}>Registrar nueva</button>
      <button onClick={() => intentar("cliente@maestros.cl")}>Registrar repetida</button>
    </div>
  );
}

describe("AuthContext - registrar", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  it("crea la cuenta y deja la sesión iniciada", async () => {
    // Arrange
    render(<AuthProvider><Panel /></AuthProvider>);

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Registrar nueva" }));

    // Assert
    expect(screen.getByTestId("correo").textContent).toBe("ana@correo.cl");
    expect(JSON.parse(localStorage.getItem("ferreteria_sesion")).correo).toBe("ana@correo.cl");
  });

  it("deja pasar el error y no inicia sesión si el correo ya existe", async () => {
    // Arrange
    render(<AuthProvider><Panel /></AuthProvider>);

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Registrar repetida" }));

    // Assert
    expect(screen.getByTestId("mensaje").textContent).toBe("Ya existe una cuenta con ese correo.");
    expect(screen.getByTestId("correo").textContent).toBe("sin sesión");
  });
});
