import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000');

function ResumenGeneral() {
  const [estadisticas, setEstadisticas] = useState({
    totalProductos: 0,
    productosBajoStock: 0,
  });

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/productos/estadisticas')
      .then((res) => setEstadisticas(res.data))
      .catch((err) => console.error('Error al obtener estadísticas:', err));
  }, []);

  return (
    <div className="p-6 m-6 rounded-lg">
    <h1 className="text-4xl font-bold mb-8 text-center text-olive-800 tracking-wider">
      Sistema de Gestión de Stock
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-6 bg-gradient-to-br from-green-700 to-green-600 text-white shadow-md rounded-lg transition-transform duration-300 hover:scale-105">
        <h2 className="text-lg font-medium mb-1 tracking-wide">Productos Totales</h2>
        <p className="text-4xl font-bold">{estadisticas.totalProductos}</p>
      </div>
      <div className="p-6 bg-gradient-to-br from-blue-700 to-blue-500 text-white shadow-md rounded-lg transition-transform duration-300 hover:scale-105">
        <h2 className="text-lg font-medium mb-1 tracking-wide">Productos con Bajo Stock</h2>
        <p className="text-4xl font-bold">{estadisticas.productosBajoStock}</p>
      </div>
    </div>
  </div>
  
  
  );
  
  
}


export default ResumenGeneral;
