import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import AdminUsuarios from "./AdminUsuarios";
import { AuthProvider } from "../context/AuthContext";
import { iniciarSesionDePrueba } from "../test/sesionDePrueba";
import {
  listarUsuarios,
  listarRoles,
  crearUsuario,
  actualizarUsuario,
  desactivarUsuario,
} from "../services/usuariosService";

// Se simula el servicio: la pantalla no llama al backend durante la prueba
vi.mock("../services/usuariosService", () => ({
  listarUsuarios: vi.fn(),
  listarRoles: vi.fn(),
  crearUsuario: vi.fn(),
  actualizarUsuario: vi.fn(),
  desactivarUsuario: vi.fn(),
}));

const ADMIN = { id: 1, nombre: "Administrador", apellidos: "Los Maestros", correo: "admin@maestros.cl", rol: "admin", activo: true };
const CLIENTE = { id: 4, nombre: "Camila", apellidos: "Soto Reyes", correo: "cliente@maestros.cl", rol: "cliente", activo: true };
const ROLES = [
  { id: 1, nombre: "admin" }, { id: 2, nombre: "vendedor" }, { id: 3, nombre: "contratista" }, { id: 4, nombre: "cliente" },
];

function renderizar() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/admin/usuarios"]}>
        <AdminUsuarios />
      </MemoryRouter>
    </AuthProvider>
  );
}

function filaDe(correo) {
  return screen.getByText(correo).closest("tr");
}

describe("AdminUsuarios", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    iniciarSesionDePrueba(ADMIN);
    listarUsuarios.mockResolvedValue([ADMIN, CLIENTE]);
    listarRoles.mockResolvedValue(ROLES);
  });

  it("lista los usuarios y fija el título", async () => {
    // Arrange + Act
    renderizar();

    // Assert
    expect(await screen.findByText("cliente@maestros.cl")).toBeInTheDocument();
    expect(screen.getByText("admin@maestros.cl")).toBeInTheDocument();
    expect(document.title).toBe("Administrar usuarios | Ferretería Los Maestros");
  });

  it("no ofrece desactivar la propia cuenta", async () => {
    // Arrange + Act
    renderizar();
    await screen.findByText("cliente@maestros.cl");

    // Assert
    expect(within(filaDe("admin@maestros.cl")).queryByRole("button", { name: "Desactivar" })).not.toBeInTheDocument();
    expect(within(filaDe("cliente@maestros.cl")).getByRole("button", { name: "Desactivar" })).toBeInTheDocument();
  });

  it("crea un usuario con rol vendedor", async () => {
    // Arrange
    crearUsuario.mockResolvedValue({ id: 9 });
    renderizar();
    await screen.findByText("cliente@maestros.cl");
    await userEvent.click(screen.getByRole("button", { name: "Nuevo usuario" }));
    const dialogo = screen.getByRole("dialog");

    // Act
    await userEvent.type(within(dialogo).getByLabelText("Nombre"), "Luis");
    await userEvent.type(within(dialogo).getByLabelText("Apellidos"), "Vende Mucho");
    await userEvent.type(within(dialogo).getByLabelText("Correo electrónico"), "luis@maestros.cl");
    await userEvent.type(within(dialogo).getByLabelText("Contraseña"), "Luis1234!");
    await userEvent.selectOptions(within(dialogo).getByLabelText("Rol"), "vendedor");
    await userEvent.click(within(dialogo).getByRole("button", { name: "Crear usuario" }));

    // Assert
    expect(await screen.findByText('Usuario "Luis Vende Mucho" creado.')).toBeInTheDocument();
    expect(crearUsuario).toHaveBeenCalledWith(expect.objectContaining({ correo: "luis@maestros.cl", rol: "vendedor" }));
  });

  it("muestra los errores de validación y no llama a la API", async () => {
    // Arrange
    renderizar();
    await screen.findByText("cliente@maestros.cl");
    await userEvent.click(screen.getByRole("button", { name: "Nuevo usuario" }));

    // Act
    await userEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Crear usuario" }));

    // Assert
    expect(screen.getByText("El nombre es obligatorio.")).toBeInTheDocument();
    expect(crearUsuario).not.toHaveBeenCalled();
  });

  it("muestra el error del backend si el correo ya existe", async () => {
    // Arrange
    crearUsuario.mockRejectedValue(new Error("Ya existe una cuenta con ese correo."));
    renderizar();
    await screen.findByText("cliente@maestros.cl");
    await userEvent.click(screen.getByRole("button", { name: "Nuevo usuario" }));
    const dialogo = screen.getByRole("dialog");

    // Act
    await userEvent.type(within(dialogo).getByLabelText("Nombre"), "Otro");
    await userEvent.type(within(dialogo).getByLabelText("Apellidos"), "Admin");
    await userEvent.type(within(dialogo).getByLabelText("Correo electrónico"), "admin@maestros.cl");
    await userEvent.type(within(dialogo).getByLabelText("Contraseña"), "Clave123!");
    await userEvent.click(within(dialogo).getByRole("button", { name: "Crear usuario" }));

    // Assert
    expect(await within(dialogo).findByText("Ya existe una cuenta con ese correo.")).toBeInTheDocument();
  });

  it("edita el rol de un usuario", async () => {
    // Arrange
    actualizarUsuario.mockResolvedValue({ ...CLIENTE, rol: "contratista" });
    renderizar();
    await screen.findByText("cliente@maestros.cl");
    await userEvent.click(within(filaDe("cliente@maestros.cl")).getByRole("button", { name: "Editar" }));
    const dialogo = screen.getByRole("dialog");

    // Act
    await userEvent.selectOptions(within(dialogo).getByLabelText("Rol"), "contratista");
    await userEvent.click(within(dialogo).getByRole("button", { name: "Guardar cambios" }));

    // Assert
    expect(await screen.findByText('Usuario "Camila Soto Reyes" actualizado.')).toBeInTheDocument();
    expect(actualizarUsuario).toHaveBeenCalledWith(4, expect.objectContaining({ rol: "contratista" }));
  });

  it("pide confirmación y desactiva un usuario", async () => {
    // Arrange
    desactivarUsuario.mockResolvedValue();
    renderizar();
    await screen.findByText("cliente@maestros.cl");
    await userEvent.click(within(filaDe("cliente@maestros.cl")).getByRole("button", { name: "Desactivar" }));

    // Act
    await userEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Desactivar" }));

    // Assert
    expect(await screen.findByText("Se desactivó la cuenta de cliente@maestros.cl.")).toBeInTheDocument();
    expect(desactivarUsuario).toHaveBeenCalledWith(4);
  });

  it("reactiva una cuenta inactiva", async () => {
    // Arrange
    listarUsuarios.mockResolvedValue([ADMIN, { ...CLIENTE, activo: false }]);
    actualizarUsuario.mockResolvedValue({ ...CLIENTE, activo: true });
    renderizar();
    await screen.findByText("cliente@maestros.cl");

    // Act
    await userEvent.click(within(filaDe("cliente@maestros.cl")).getByRole("button", { name: "Activar" }));

    // Assert
    expect(await screen.findByText("Se activó la cuenta de cliente@maestros.cl.")).toBeInTheDocument();
    expect(actualizarUsuario).toHaveBeenCalledWith(4, expect.objectContaining({ activo: true }));
  });

  it("muestra un aviso si no puede cargar los usuarios", async () => {
    // Arrange
    listarUsuarios.mockRejectedValue(new Error("No pudimos cargar los usuarios."));

    // Act
    renderizar();

    // Assert
    expect(await screen.findByText("No pudimos cargar los usuarios.")).toBeInTheDocument();
  });
});
