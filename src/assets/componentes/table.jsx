import React, { useState, useEffect } from "react";
import Opciones from "./opcion";
import { TaskProvider } from "../../TaskContext";

function Table() {
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}obtenerTareas`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || "Error al obtener las tareas");
        }

        const result = await response.json();
        setData(result);
        setFilteredData(result);
      } catch (error) {
        setError(error.message || "Error de red o del servidor. Inténtelo más tarde.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!filter) {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        filter === "Activo" ? item.status : !item.status
      );
      setFilteredData(filtered);
    }
  }, [filter, data]);

  return (
    <TaskProvider>
      <div className="flex flex-col">
        {error && <p className="text-red-500 text-center py-2">{error}</p>}

        <div className="py-4 px-6 bg-gray-100 rounded-lg shadow-md flex items-center gap-4">
          <label htmlFor="filter" className="text-gray-700 font-medium">
            Filtrar por estado:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Todos</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className="w-full mt-6">
          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-blue-100 border-b border-gray-300 font-medium text-gray-800">
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">Titulo</th>
                  <th className="px-6 py-3">Descripcion</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3">Fecha de creacion</th>
                  <th className="px-6 py-3">Opciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-300 hover:bg-blue-50 transition"
                  >
                    <td className="px-6 py-3 font-medium">{row.number}</td>
                    <td className="px-6 py-3">{row.titulo}</td>
                    <td className="px-6 py-3">{row.descripcion}</td>
                    <td className="px-6 py-3">{row.status ? "Activo" : "Inactivo"}</td>
                    <td className="px-6 py-3">{row.createdAt}</td>
                    <td className="px-6 py-3">
                      <Opciones id={row._id} titulo={row.titulo} descripcion={row.descripcion} status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </TaskProvider>
  );
}

export default Table;
