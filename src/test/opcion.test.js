import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Opciones from "./Opciones";
import { TaskContextProvider } from "../../TaskContext";

// Mocking the useTask hook to control its behavior in tests
jest.mock("../../TaskContext", () => ({
  useTask: () => ({
    setSelectedTaskId: jest.fn(),
  }),
}));

describe("Opciones Component", () => {
  const taskData = {
    id: "1",
    titulo: "Tarea de prueba",
    descripcion: "Descripción de la tarea",
    status: "Activo",
  };

  const renderComponent = (props) => {
    return render(
      <TaskContextProvider>
        <Opciones {...props} />
      </TaskContextProvider>
    );
  };

  test("debe mostrar los botones de acción: Editar, Eliminar, Ver", () => {
    renderComponent(taskData);

    // Verifica si los botones están presentes en el documento
    expect(screen.getByText("Eliminar")).toBeInTheDocument();
    expect(screen.getByText("Editar")).toBeInTheDocument();
    expect(screen.getByText("Ver")).toBeInTheDocument();
  });

  test("debe abrir el modal de 'Ver' al hacer clic en 'Ver'", () => {
    renderComponent(taskData);

    fireEvent.click(screen.getByText("Ver"));

    // Verifica si el modal de 'Ver' se muestra
    expect(screen.getByText("Ver Tarea")).toBeInTheDocument();
    expect(screen.getByText("Título: Tarea de prueba")).toBeInTheDocument();
    expect(screen.getByText("Descripción: Descripción de la tarea")).toBeInTheDocument();
    expect(screen.getByText("Estado: Activo")).toBeInTheDocument();
  });

  test("debe abrir el modal de 'Editar' al hacer clic en 'Editar'", () => {
    renderComponent(taskData);

    fireEvent.click(screen.getByText("Editar"));

    // Verifica si el modal de 'Editar' se muestra
    expect(screen.getByText("Editar Tarea")).toBeInTheDocument();
    expect(screen.getByLabelText("Título")).toHaveValue("Tarea de prueba");
    expect(screen.getByLabelText("Descripción")).toHaveValue("Descripción de la tarea");
    expect(screen.getByLabelText("Estado")).toHaveValue("Activo");
  });

  test("debe abrir el modal de 'Eliminar' al hacer clic en 'Eliminar'", () => {
    renderComponent(taskData);

    fireEvent.click(screen.getByText("Eliminar"));

    // Verifica si el modal de 'Eliminar' se muestra
    expect(screen.getByText("Eliminar Tarea")).toBeInTheDocument();
    expect(screen.getByText("¿Estás seguro que deseas eliminar la tarea con ID: Tarea de prueba?")).toBeInTheDocument();
  });

  test("debe cerrar el modal cuando se haga clic en el botón de cerrar", () => {
    renderComponent(taskData);

    fireEvent.click(screen.getByText("Ver"));

    // Asegura que el modal se muestra
    expect(screen.getByText("Ver Tarea")).toBeInTheDocument();

    // Hace clic en el botón de cerrar
    fireEvent.click(screen.getByLabelText("close modal"));

    // Verifica que el modal se haya cerrado
    expect(screen.queryByText("Ver Tarea")).not.toBeInTheDocument();
  });

  test("debe ejecutar la función handleConfirmEdit al hacer clic en 'Editar' dentro del modal", async () => {
    const mockHandleConfirmEdit = jest.fn();

    // Overriding the function for test
    Opciones.prototype.handleConfirmEdit = mockHandleConfirmEdit;

    renderComponent(taskData);

    fireEvent.click(screen.getByText("Editar"));
    fireEvent.click(screen.getByText("Editar"));

    await waitFor(() => {
      expect(mockHandleConfirmEdit).toHaveBeenCalledTimes(1);
    });
  });

  test("debe ejecutar la función handleConfirmDelete al hacer clic en 'Eliminar' dentro del modal", async () => {
    const mockHandleConfirmDelete = jest.fn();

    // Overriding the function for test
    Opciones.prototype.handleConfirmDelete = mockHandleConfirmDelete;

    renderComponent(taskData);

    fireEvent.click(screen.getByText("Eliminar"));
    fireEvent.click(screen.getByText("Eliminar"));

    await waitFor(() => {
      expect(mockHandleConfirmDelete).toHaveBeenCalledTimes(1);
    });
  });
});
