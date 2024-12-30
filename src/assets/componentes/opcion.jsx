import React, { useState } from "react";
import { useTask } from "../../TaskContext";

function Opciones({ id, titulo: initialTitulo, descripcion: initialDescripcion, status: initialStatus }) {
  const { setSelectedTaskId } = useTask();
  const [titulo, setTitulo] = useState(initialTitulo || "");
  const [descripcion, setDescripcion] = useState(initialDescripcion || "");
  const [status, setStatus] = useState(initialStatus || false);
  const [error, setError] = useState("");




  const [modal, setModal] = useState(null); // "view" | "edit" | "delete"

  const closeModal = () => setModal(null);

  const handleView = () => {
    setSelectedTaskId(id);
    setModal("view");
  };

  const handleEdit = () => {
    setSelectedTaskId(id);
    setModal("edit");
  };

  const handleConfirmEdit = async () => {
    if (!id) {
      console.error("ID no proporcionado.");
      return;
    }

    const status1 = status === "Activo" ? true : false;

    const formData = { titulo, descripcion, status1 };
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}actualizarTarea/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Tarea editada con éxito:", result);
        // closeModal();
        window.location.reload(); // Recargar la página
      } else {
        setError(result.message || "Error al editar la tarea.");
      }
    } catch (error) {
      setError("Error de red o del servidor. Inténtelo más tarde.");
      console.error("Error al editar la tarea:", error);
    }
  };


  const handleDelete = () => {
    setSelectedTaskId(id);
    setModal("delete");
  };

  const handleConfirmDelete = async () => {
      closeModal();
  if (!id) {
      console.error("ID no proporcionado.");
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}eliminarTarea/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }), // Aunque no siempre es necesario enviar el ID en el cuerpo para un DELETE
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log("Tarea eliminada con éxito:", result);
        window.location.reload(); // Recargar la página
      } else {
        console.error(result.message || "Error al eliminar la tarea.");
      }
    } catch (error) {
      console.error("Error de red o del servidor:", error);
    }
  };
  

  return (
    <>
      <button
        onClick={handleDelete}
        className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 ml-3 bg-red-100 transition duration-150 text-gray-600 ease-in-out hover:border-red-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"
        >
        Eliminar
      </button>
      <button
        onClick={handleEdit}
        className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"

      >
        Editar
      </button>
      <button
        onClick={handleView}
        className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"

      >
        Ver
      </button>

      {modal && (
        <div className="py-12 bg-gray-700/50 transition duration-150 ease-in-out z-10 fixed top-0 right-0 bottom-0 left-0 flex justify-center items-center">
          <div
            role="alert"
            className="container mx-auto w-11/12 md:w-2/3 max-w-lg"
          >
            <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">
              <h1 className="text-gray-800 font-lg font-bold tracking-normal leading-tight mb-4">
                {modal === "view" && "Ver Tarea"}
                {modal === "edit" && "Editar Tarea"}
                {modal === "delete" && "Eliminar Tarea"}
              </h1>

              {modal === "view" && (
                <div>
                  <p className="mb-4">
                    <span className="font-bold">Título:</span> {titulo}
                  </p>
                  <p className="mb-4">
                    <span className="font-bold">Descripción:</span> {descripcion}
                    {descripcion}
                  </p>
                  <p className="mb-4">
                    <span className="font-bold">Estado:</span> {status}
                    {status ? "Activo" : "Inactivo"}
                  </p>
                </div>
              )}

              {modal === "edit" && (
                <form>
                  <div>
                    <label
                      htmlFor="titulo"
                      className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
                    >
                      Título
                    </label>
                    <input
                      defaultValue={titulo}
                        onChange={(e) => setTitulo(e.target.value)}

                      id="titulo"
                      name="titulo"
                      type="text"
                      className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border"
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
                        onChange={(e) => setDescripcion(e.target.value)}
                      defaultValue={descripcion}
                      id="descripcion"
                      name="descripcion"
                      className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-20 flex items-center pl-3 text-sm border-gray-300 rounded border"
                    />
                  </div>
                  <div>
                    <label
                        htmlFor="status"
                        className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
                    >
                        Estado
                    </label>
                    <select
                        onChange={(e) => setStatus(e.target.value)}
                        defaultValue={status  ? "Activo" : "Inactivo"}
                        id="status"
                        name="status"
                        className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border"
                    >
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>

                  </div>
                  {error && (
          <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4 rounded-md" role="alert">
            <p className="font-bold">¡Atención!</p>
            <p>{error}</p>
          </div>
        )}
                </form>
                
              )}

              {modal === "delete" && (
                <p className="text-red-500">
                  ¿Estás seguro que deseas eliminar la tarea con ID: {titulo}?
                </p>
              )}

              <div className="flex items-center justify-start w-full mt-4">
                <button
                  type="button"
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"

                  onClick={closeModal}
                >
                  {modal === "delete" ? "Cancelar" : "Cerrar"}
                </button>
                {modal === "delete" && (
                  <button
                  type="submit"
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
                    onClick={handleConfirmDelete}
                  >
                    Eliminar
                  </button>
                )}
                {modal === "edit" && (
                  <button
                    type="submit"
                    className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
                    onClick={handleConfirmEdit}
                  >
                    Editar
                  </button>
                )}
              </div>

              <button
                className="cursor-pointer absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:outline-none focus:ring-gray-600"
                onClick={closeModal}
                aria-label="close modal"
                role="button"
              >
                ✖
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Opciones;
