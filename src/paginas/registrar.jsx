import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
function Registrar() {
  const [error, setError] = React.useState('');
  const [exit, setExit] = React.useState(''); // No se esta usando
  const [nombre, setNombre] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [contrasena, setPassword] = React.useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Acceder al método login desde el contexto

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas en el frontend
    if (!nombre || !email || !contrasena) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    if (contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    // Preparar los datos para enviar
    const formData = { nombre, email, contrasena };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}crearUsuario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

    if (response.ok) {
      // Token recibido
      if (result.token) {
        login(result.token); // Guardar token en el contexto
        navigate('/tasks'); // Redirigir a la página de tareas
        setExit('Usuario creado exitosamente.');
      } else {
        setError('No se recibió un token del servidor.');
      }
    } else {
      setError(result.msg || 'Error al crear usuario');
    }
  } catch (err) {
    setError('Error de red o del servidor. Inténtelo más tarde.');
  }
};


    return (

        <>
        {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-white">
          <body class="h-full">
          ```
        */}
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">

            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Registrarse
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit}  method="POST" className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                  Nombre
                </label>
                <div className="mt-2">
                  <input
                  onChange={(e) => setNombre(e.target.value)}
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="text"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                  Correo
                </label>
                <div className="mt-2">
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Contraseña
                  </label>
                  
                </div>
                <div className="mt-2">
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
              {error && (
          <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4 rounded-md" role="alert">
            <p className="font-bold">¡Atención!</p>
            <p>{error}</p>
          </div>
        )}
        {exit && (
          <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4 rounded-md" role="alert">
            <p className="font-bold">exitoso!</p>
            <p>{exit}</p>
          </div>
        )}
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Registrar
                </button>
              </div>
            </form>
  
            <p className="mt-10 text-center text-sm/6 text-gray-500">
              <a href="/" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Ya tengo cuenta{' '}
               </a>
            </p>
          </div>
        </div>
      </>
    );
    
}

export default Registrar;