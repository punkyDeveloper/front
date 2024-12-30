import { useState } from "react";
import React from "react";

function ModalCrear() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");
  const [exit, setExit] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const handleModal = (val) => {
    setIsOpen(val);
    setError("");
    setExit("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar error previo
    setExit(""); // Limpiar mensaje de éxito previo

    if (!titulo ) {
      setError("rellenar el campo titulo");
      return;
    }

    const formData = { titulo, descripcion };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}crearTarea`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setExit(result.message || "Tiket creado con éxito.");
        setTitulo("");
        setDescripcion("");
        setTimeout(() => {
          handleModal(false); // Cerrar modal
          window.location.reload(); // Recargar la página
        }, 500);
      } else {
        setError(result.message || "Error al crear el tiket.");
      }
    } catch (err) {
      setError("Error de red o del servidor. Inténtelo más tarde.");
    }
  };

  return (
    <>
      <div className="py-4 px-6">
        <button
          className="ms-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 mx-auto transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-4 sm:px-8 py-2 text-xs sm:text-sm"
          onClick={() => handleModal(true)}
        >
          Crear task
        </button>
      </div>

      {isOpen && (
        <div className="py-12 bg-gray-700/50 transition duration-150 ease-in-out z-10 fixed top-0 right-0 bottom-0 left-0 flex justify-center items-center">
          <div
            role="alert"
            className="container mx-auto w-11/12 md:w-2/3 max-w-lg"
          >
            <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">
              <h1 className="text-gray-800 font-lg font-bold tracking-normal leading-tight mb-4">
                Crear tiket
              </h1>

              <form onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="titulo"
                    className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
                  >
                    Título
                  </label>
                  <input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    id="titulo"
                    name="titulo"
                    type="text"
                    required
                    className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border"
                    placeholder="Título del tiket"
                  />
                </div>
                <div>
                  <label
                    htmlFor="descripcion"
                    className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
                  >
                    Descripción
                  </label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    id="descripcion"
                    name="descripcion"
                    className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-20 flex items-center pl-3 text-sm border-gray-300 rounded border"
                    placeholder="Descripción del tiket"
                  />
                </div>

                {error && (
                  <div
                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md"
                    role="alert"
                  >
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                  </div>
                )}
                {exit && (
                  <div
                    className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-md"
                    role="alert"
                  >
                    <p className="font-bold">Éxito</p>
                    <p>{exit}</p>
                  </div>
                )}

                <div className="flex items-center justify-start w-full">
                  <button
                    type="submit"
                    className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
                  >
                    Crear
                  </button>

                  <button
                    type="button"
                    className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"
                    onClick={() => handleModal(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>

              <button
                className="cursor-pointer absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:outline-none focus:ring-gray-600"
                onClick={() => handleModal(false)}
                aria-label="close modal"
                role="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-x"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ModalCrear;
