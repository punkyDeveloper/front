import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Table from "../assets/componentes/table"; 
import { TaskProvider } from "../paginas/tasks"; 

// Mock the fetch function
global.fetch = jest.fn();

describe("Table component", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test("renders Table component without crashing", () => {
    render(
      <TaskProvider>
        <Table />
      </TaskProvider>
    );
    // Check if the table header is rendered
    expect(screen.getByText("#")).toBeInTheDocument();
    expect(screen.getByText("Titulo")).toBeInTheDocument();
    expect(screen.getByText("Descripcion")).toBeInTheDocument();
  });

  test("displays error message when fetch fails", async () => {
    // Mock the fetch to simulate an error response
    fetch.mockRejectedValueOnce(new Error("Error de red"));

    render(
      <TaskProvider>
        <Table />
      </TaskProvider>
    );

    await waitFor(() => expect(screen.getByText("Error de red")).toBeInTheDocument());
  });

  test("displays table rows after data is fetched", async () => {
    const mockData = [
      { id: "1", number: "1", titulo: "Task 1", descripcion: "Description 1", status: true, createdAt: "2024-12-01" },
      { id: "2", number: "2", titulo: "Task 2", descripcion: "Description 2", status: false, createdAt: "2024-12-02" },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(
      <TaskProvider>
        <Table />
      </TaskProvider>
    );

    // Wait for the data to be fetched and check if the rows are displayed
    await waitFor(() => expect(screen.getByText("Task 1")).toBeInTheDocument());
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  test("filters table rows by 'Activo' status", async () => {
    const mockData = [
      { id: "1", number: "1", titulo: "Task 1", descripcion: "Description 1", status: true, createdAt: "2024-12-01" },
      { id: "2", number: "2", titulo: "Task 2", descripcion: "Description 2", status: false, createdAt: "2024-12-02" },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(
      <TaskProvider>
        <Table />
      </TaskProvider>
    );

    // Wait for the data to be fetched
    await waitFor(() => screen.getByText("Task 1"));

    // Filter the table to show only 'Activo' tasks
    fireEvent.change(screen.getByLabelText(/Filtrar por estado:/), { target: { value: "Activo" } });

    // Check that only the 'Activo' task is visible
    await waitFor(() => expect(screen.queryByText("Task 1")).toBeInTheDocument());
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
  });

  test("filters table rows by 'Inactivo' status", async () => {
    const mockData = [
      { id: "1", number: "1", titulo: "Task 1", descripcion: "Description 1", status: true, createdAt: "2024-12-01" },
      { id: "2", number: "2", titulo: "Task 2", descripcion: "Description 2", status: false, createdAt: "2024-12-02" },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(
      <TaskProvider>
        <Table />
      </TaskProvider>
    );

    // Wait for the data to be fetched
    await waitFor(() => screen.getByText("Task 1"));

    // Filter the table to show only 'Inactivo' tasks
    fireEvent.change(screen.getByLabelText(/Filtrar por estado:/), { target: { value: "Inactivo" } });

    // Check that only the 'Inactivo' task is visible
    await waitFor(() => expect(screen.queryByText("Task 2")).toBeInTheDocument());
    expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
  });
});
