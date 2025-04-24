import React, { useState, useEffect } from 'react';
import ResumenGeneral from './components/ResumenGeneral';
import ProductosForm from './components/ProductosForm';
import ProductosList from './components/ProductosList';
import { ToastContainer, toast } from 'react-toastify';
import TotalStock from './components/TotalStock';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function App() {
  const [productoEditado, setProductoEditado] = useState(null); // Estado del producto a editar
  const [estadisticas, setEstadisticas] = useState({
    totalProductos: 0,
    productosBajoStock: 0,
  });
  const [darkMode, setDarkMode] = useState(false); // Estado para dark mode

  // Alternar Dark Mode
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode(!darkMode);
  };

  // Función para obtener estadísticas
  const obtenerEstadisticas = () => {
    axios
      .get('http://localhost:3000/api/productos/estadisticas')
      .then((res) => setEstadisticas(res.data))
      .catch((err) => console.error('Error al obtener estadísticas:', err));
  };

  useEffect(() => {
    obtenerEstadisticas();
  }, []);

  // Función para manejar la edición de un producto
  const manejarEdicion = (producto) => {
    setProductoEditado(producto);
  };

  // Función para limpiar el producto editado
  const limpiarProductoEditado = () => {
    setProductoEditado(null);
    obtenerEstadisticas(); // Actualizamos estadísticas
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-dark-200 transition-colors duration-300">
      {/* Botón para alternar Dark Mode */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleDarkMode}
          className="bg-blue-500 dark:bg-yellow-400 text-white dark:text-gray-800 px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-yellow-500 transition"
        >
          {darkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
      {/* Resumen General */}
      <ResumenGeneral
        totalProductos={estadisticas.totalProductos}
        bajoStock={estadisticas.productosBajoStock}
      />

      {/* Grid para Formulario y Lista de Productos */}
      <div className="mt-8 flex flex-col md:flex-row gap-8">
        {/* Formulario */}
        <div className="md:w-1/3 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md h-fit">
          <ProductosForm
            productoEditado={productoEditado}
            onProductoAgregado={limpiarProductoEditado}
          />
        </div>

        {/* Lista de Productos */}
        <div className="md:w-2/3 p-6 dark:bg-gray-800 rounded-lg shadow-md">
          <ProductosList onEdit={manejarEdicion} />
        </div>
        <div>
          <TotalStock />
        </div>
      </div>
    </div>
  );
}

export default App;
