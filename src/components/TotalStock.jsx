import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TotalStock() {
  const [totalStock, setTotalStock] = useState(0);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/productos/total-stock') // Ruta para obtener el total del stock
      .then((res) => setTotalStock(res.data.totalStock))
      .catch((err) => console.error('Error al obtener el total del stock:', err));
  }, []);

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
      <h2 className="text-lg font-bold text-blue-700">Total de Stock</h2>
      <p className="text-3xl font-extrabold text-blue-800">{totalStock}</p>
    </div>
  );
}

export default TotalStock;
