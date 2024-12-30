import { render, screen, fireEvent } from '@testing-library/react';
import App from '../paginas/App';
import { BrowserRouter } from 'react-router-dom';

describe('Componente App', () => {
  test('Renderiza correctamente el formulario', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Verificar elementos básicos
    expect(screen.getByLabelText(/Correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Iniciar sesión/i })).toBeInTheDocument();
  });

  test('Muestra error si los campos están vacíos al enviar', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

    // Verificar mensaje de error
    expect(screen.getByText(/Por favor, completa todos los campos./i)).toBeInTheDocument();
  });

  test('Simula llamada exitosa a la API y redirecciona', async () => {
    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'test-token' }),
    });

    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: 'test@mail.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

    // Esperar redirección
    await screen.findByText(/tasks/i);
    expect(mockNavigate).toHaveBeenCalledWith('/tasks');
    mockFetch.mockRestore();
  });

  test('Muestra error si la API responde con error', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => ({ msg: 'Credenciales inválidas' }),
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: 'test@mail.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

    // Verificar mensaje de error
    expect(await screen.findByText(/Credenciales inválidas/i)).toBeInTheDocument();
  });
});
