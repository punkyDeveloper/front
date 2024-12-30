import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Registrar from './Registrar';
import { MemoryRouter } from 'react-router-dom'; // Para que use rutas sin necesidad de un servidor real
import { useAuth } from '../AuthContext'; // Si estás usando un contexto de autenticación

jest.mock('../AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('Componente Registrar', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({ login: mockLogin });
  });

  test('debe mostrar un error si los campos están vacíos', async () => {
    render(
      <MemoryRouter>
        <Registrar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Registrar/i));

    await waitFor(() => expect(screen.getByText(/Por favor, complete todos los campos./i)).toBeInTheDocument());
  });

  test('debe mostrar un error si la contraseña es demasiado corta', async () => {
    render(
      <MemoryRouter>
        <Registrar />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: 'juan@correo.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: '123' } });

    fireEvent.click(screen.getByText(/Registrar/i));

    await waitFor(() => expect(screen.getByText(/La contraseña debe tener al menos 6 caracteres./i)).toBeInTheDocument());
  });

  test('debe mostrar un error si el correo no tiene formato válido', async () => {
    render(
      <MemoryRouter>
        <Registrar />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: 'juancorreo.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: '123456' } });

    fireEvent.click(screen.getByText(/Registrar/i));

    await waitFor(() => expect(screen.getByText(/Por favor, ingrese un correo válido./i)).toBeInTheDocument());
  });

  test('debe registrar un usuario exitosamente y redirigir', async () => {
    render(
      <MemoryRouter>
        <Registrar />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: 'juan@correo.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: '123456' } });

    const mockResponse = { token: 'fake-token' };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    fireEvent.click(screen.getByText(/Registrar/i));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('fake-token'));
    await waitFor(() => expect(screen.queryByText(/Usuario creado exitosamente./i)).toBeInTheDocument());
  });

  test('debe mostrar un mensaje de error si el servidor falla', async () => {
    render(
      <MemoryRouter>
        <Registrar />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: 'juan@correo.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: '123456' } });

    const mockResponse = { msg: 'Error al crear usuario' };
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve(mockResponse),
    });

    fireEvent.click(screen.getByText(/Registrar/i));

    await waitFor(() => expect(screen.getByText(/Error al crear usuario/i)).toBeInTheDocument());
  });
});
