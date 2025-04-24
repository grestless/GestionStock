import express from 'express';
import db from '../db.js';

const router = express.Router();

// Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Clientes');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

export default router;
