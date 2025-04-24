import express from 'express';
import db from '../db.js';

const router = express.Router();

let io; // Inicializamos io globalmente
export const setSocketIO = (socketIO) => { io = socketIO; };



router.get('/total-stock', async (req, res) => {
  try {
    const [result] = await db.execute('SELECT SUM(Stock) AS totalStock FROM Productos');
    const totalStock = result[0].totalStock || 0; // Devuelve 0 si no hay productos
    res.json({ totalStock });
  } catch (err) {
    console.error('Error al obtener el total del stock:', err);
    res.status(500).json({ error: 'Error al obtener el total del stock' });
  }
});

// Obtener productos
router.get('/', async (req, res) => {
    try {
      const [rows] = await db.execute('SELECT * FROM Productos');
      res.json(rows);
    } catch (err) {
      console.error('Error al obtener productos:', err);
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  });

  router.get('/estadisticas', async (req, res) => {
    try {
      const [total] = await db.execute('SELECT COUNT(*) AS total FROM Productos');
      const [bajoStock] = await db.execute('SELECT COUNT(*) AS bajoStock FROM Productos WHERE Stock <= 10');
  
      res.json({
        totalProductos: total[0].total,
        productosBajoStock: bajoStock[0].bajoStock,
      });
    } catch (err) {
      console.error('Error al obtener estadísticas:', err);
      res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
  });
  
  

// Crear producto
router.post('/', async (req, res) => {
    const { Nombre, Precio, Stock } = req.body;
    if (!Nombre || Precio == null || Stock == null) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
  
    try {
      await db.execute('INSERT INTO Productos (Nombre, Precio, Stock) VALUES (?, ?, ?)', [Nombre, Precio, Stock]);
      res.json({ message: 'Producto agregado' });
    } catch (err) {
      console.error('Error al agregar producto:', err);
      res.status(500).json({ error: 'Error al agregar producto' });
    }
  });



  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { Nombre, Precio, Stock } = req.body;
  
    if (!Nombre || Precio == null || Stock == null) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
  
    try {
      const [result] = await db.execute(
        'UPDATE Productos SET Nombre = ?, Precio = ?, Stock = ? WHERE ID = ?',
        [Nombre, Precio, Stock, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
  
      res.json({ message: 'Producto actualizado con éxito' });
    } catch (err) {
      console.error('Error al actualizar producto:', err);
      res.status(500).json({ error: 'Error al actualizar producto' });
    }
  });
  

  
  
  
  
// Eliminar producto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Asegúra"Productos" y el campo "ID" existen
    const [result] = await db.execute('DELETE FROM Productos WHERE ID = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Si se elimina correctamente, envía una respuesta de éxito
    res.json({ message: 'Producto eliminado con éxito' });
  } catch (err) {
    
    console.error('Error al eliminar producto:', err);
    res.status(500).json({ error: 'Error interno del servidor al eliminar el producto' });
  }
});


export default router;
