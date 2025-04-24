import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductosForm({ productoEditado, onProductoAgregado }) {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (productoEditado) {
      setNombre(productoEditado.Nombre);
      setPrecio(productoEditado.Precio);
      setStock(productoEditado.Stock);
    } else {
      resetForm(); // Resetea el formulario si no hay producto seleccionado
    }
  }, [productoEditado]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre || precio <= 0 || stock < 0) {
      setError('Todos los campos son obligatorios y deben ser válidos.');
      setSuccess('');
      return;
    }

    const nuevoProducto = { Nombre: nombre, Precio: parseFloat(precio), Stock: parseInt(stock) };

    const url = productoEditado
    ? `http://localhost:3000/api/productos/${productoEditado.ID}` // Usamos el ID del producto
    : 'http://localhost:3000/api/productos'; // Para crear un nuevo producto
  

    const request = productoEditado
      ? axios.put(url, nuevoProducto) // PUT para actualizar
      : axios.post(url, nuevoProducto); // POST para crear

    request
      .then(() => {
        setSuccess(productoEditado ? 'Producto actualizado con éxito' : 'Producto agregado con éxito');
        setError('');
        resetForm();
        onProductoAgregado(); // Notifica que se completó la acción
      })
      .catch(() => {
        setError('Ocurrió un error al procesar la solicitud.');
        setSuccess('');
      });
  };

  const resetForm = () => {
    setNombre('');
    setPrecio('');
    setStock('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {productoEditado ? 'Editar Producto' : 'Agregar Producto'}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <div className="mb-4">
        <label className="block text-gray-700">Nombre:</label>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="Nombre del Producto"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Precio:</label>
        <input
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
          type="number"
          placeholder="Precio"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Stock:</label>
        <input
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
          type="number"
          placeholder="Stock"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
      >
        {productoEditado ? 'Actualizar Producto' : 'Agregar Producto'}
      </button>
    </form>
  );
}

export default ProductosForm;
