import React from 'react';
import { render, screen } from '@testing-library/react';
import Tasks from '../paginas/tasks'; // Ajusta la ruta según tu estructura
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mockear localStorage
beforeEach(() => {
  jest.spyOn(Storage.prototype, 'getItem');
  jest.clearAllMocks();
});

describe('Tasks Component', () => {
  test('debe mostrar mensaje de autenticación cuando no hay token', () => {
    // Simular que no hay token
    Storage.prototype.getItem.mockReturnValue(null);

    render(<Tasks />);

    expect(screen.getByText('No estás autenticado. Por favor, inicia sesión.')).toBeInTheDocument();
  });

  test('debe renderizar los componentes Nav, Crear y Table cuando hay token', () => {
    // Simular que hay un token
    Storage.prototype.getItem.mockReturnValue('mockedToken');

    render(<Tasks />);

    // Verificar que los componentes se renderizan
    expect(screen.getByRole('navigation')).toBeInTheDocument(); // Nav
    expect(screen.getByText('Crear')).toBeInTheDocument(); // Componente Crear (ajusta el texto según tu implementación)
    expect(screen.getByText('Table')).toBeInTheDocument(); // Componente Table (ajusta el texto según tu implementación)
  });

  test('Nav debe estar presente cuando hay token', () => {
    // Simular que hay un token
    Storage.prototype.getItem.mockReturnValue('mockedToken');

    render(<Tasks />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
