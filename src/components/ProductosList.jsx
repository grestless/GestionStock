import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const socket = io('http://localhost:3000');

function ProductosList({ onEdit }) {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [cargando, setCargando] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [mensaje, setMensaje] = useState(''); // Estado para mensajes


  // Obtener productos
  const obtenerProductos = () => {
    setCargando(true);
    axios
      .get('http://localhost:3000/api/productos')
      .then((res) => setProductos(res.data))
      .catch((err) => console.error('Error al obtener productos:', err))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    obtenerProductos();
    socket.on('productosActualizados', obtenerProductos);
    return () => socket.off('productosActualizados');
  }, []);

  // Confirmación para eliminar producto
  const confirmarEliminacion = (id) => {
    setProductoAEliminar(id);
    setMostrarModal(true);
  };

  const eliminarProducto = () => {
    axios
      .delete(`http://localhost:3000/api/productos/${productoAEliminar}`)
      .then(() => {
        obtenerProductos();
        setMostrarModal(false);
        toast.success('Producto eliminado con éxito'); // Muestra el mensaje de éxito
      })
      .catch(() => {
        setMostrarModal(false);
        toast.error('Error al eliminar el producto. Por favor, intenta de nuevo.'); // Muestra el mensaje de error
      });
  };
  
  
  // Filtrar productos por nombre
  const productosFiltrados = productos.filter((producto) =>
    producto.Nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      {/* Mensaje de éxito o error */}
      {mensaje && (
        <div className="mb-4 p-4 text-white bg-green-500 rounded shadow">
          {mensaje}
        </div>
      )}
  
      {/* Título y Botón de Exportar */}
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-700">Lista de Productos</h2>
        <button
          onClick={() => {
            const csvContent = [
              ['Nombre', 'Precio', 'Stock'],
              ...productosFiltrados.map((p) => [p.Nombre, p.Precio, p.Stock]),
            ]
              .map((e) => e.join(','))
              .join('\n');
  
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', 'productos.csv');
            link.click();
          }}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Exportar CSV
        </button>
      </div>
  

      {/* Campo de búsqueda */}
      <input
        type="text"
        placeholder="Buscar producto..."
        className="mb-4 p-2 border rounded w-full"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      {/* Tabla de productos */}
      {cargando ? (
        <p className="text-center text-blue-500">Cargando productos...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse bg-white shadow-sm rounded-lg ">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Precio</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((producto) => (
                <tr
                  key={producto.ID}
                  className="border-b hover:bg-gray-100 transition-all duration-300 ease-in-out"
                  style={{ animation: 'fadeIn 0.5s' }}
                >
                  <td className="p-3 flex items-center space-x-2">
                    {producto.Stock <= 5 && (
                      <span className="text-yellow-500 font-bold text-lg">⚠️</span>
                    )}
                    <span>{producto.Nombre}</span>
                  </td>
                  <td className="p-3">${producto.Precio}</td>
                  <td className="p-3">{producto.Stock}</td>
                  <td className="p-3 flex space-x-2">
                    <button
                      onClick={() => onEdit(producto)}
                      className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => confirmarEliminacion(producto.ID)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Confirmación */}
      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              ¿Estás seguro de que deseas eliminar este producto?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={eliminarProducto}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductosList;


