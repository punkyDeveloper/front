import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ModalCrear from '../assets/componentes/create';

// Mocking fetch to simulate API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: 'Tiket creado con éxito.' }),
  })
);

describe('ModalCrear Component', () => {
  test('should render the "Crear task" button', () => {
    render(<ModalCrear />);
    const button = screen.getByText('Crear task');
    expect(button).toBeInTheDocument();
  });

  test('should open the modal when the button is clicked', () => {
    render(<ModalCrear />);
    const button = screen.getByText('Crear task');
    fireEvent.click(button);
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
  });

  test('should close the modal when "Cancelar" is clicked', () => {
    render(<ModalCrear />);
    const button = screen.getByText('Crear task');
    fireEvent.click(button);
    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);
    const modal = screen.queryByRole('dialog');
    expect(modal).toBeNull();
  });

  test('should show an error message when the form is submitted with an empty title', async () => {
    render(<ModalCrear />);
    const button = screen.getByText('Crear task');
    fireEvent.click(button);

    const submitButton = screen.getByText('Crear');
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText('rellenar el campo titulo');
    expect(errorMessage).toBeInTheDocument();
  });

  test('should show a success message when the form is submitted with valid data', async () => {
    render(<ModalCrear />);
    const button = screen.getByText('Crear task');
    fireEvent.click(button);

    const tituloInput = screen.getByLabelText('Título');
    const descripcionInput = screen.getByLabelText('Descripción');
    fireEvent.change(tituloInput, { target: { value: 'New Task' } });
    fireEvent.change(descripcionInput, { target: { value: 'Task Description' } });

    const submitButton = screen.getByText('Crear');
    fireEvent.click(submitButton);

    const successMessage = await screen.findByText('Tiket creado con éxito.');
    expect(successMessage).toBeInTheDocument();
  });

  test('should show an error message when the API call fails', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Error al crear el tiket.' }),
      })
    );

    render(<ModalCrear />);
    const button = screen.getByText('Crear task');
    fireEvent.click(button);

    const tituloInput = screen.getByLabelText('Título');
    const descripcionInput = screen.getByLabelText('Descripción');
    fireEvent.change(tituloInput, { target: { value: 'New Task' } });
    fireEvent.change(descripcionInput, { target: { value: 'Task Description' } });

    const submitButton = screen.getByText('Crear');
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText('Error al crear el tiket.');
    expect(errorMessage).toBeInTheDocument();
  });

  test('should close the modal and reset fields after successful submission', async () => {
    render(<ModalCrear />);
    const button = screen.getByText('Crear task');
    fireEvent.click(button);

    const tituloInput = screen.getByLabelText('Título');
    const descripcionInput = screen.getByLabelText('Descripción');
    fireEvent.change(tituloInput, { target: { value: 'New Task' } });
    fireEvent.change(descripcionInput, { target: { value: 'Task Description' } });

    const submitButton = screen.getByText('Crear');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const successMessage = screen.getByText('Tiket creado con éxito.');
      expect(successMessage).toBeInTheDocument();
    });

    const modal = screen.queryByRole('dialog');
    expect(modal).toBeNull();

    const tituloInputAfterSubmit = screen.getByLabelText('Título');
    expect(tituloInputAfterSubmit.value).toBe('');
    const descripcionInputAfterSubmit = screen.getByLabelText('Descripción');
    expect(descripcionInputAfterSubmit.value).toBe('');
  });
});
