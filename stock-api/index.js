import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import productosRouter from './routes/productos.js';

const app = express();
const PORT = 3000;

// Crear servidor HTTP y configurar Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" }, // Permite conexiones desde React
});

// Middleware
app.use(cors());
app.use(express.json());

// Pasar io a las rutas
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rutas
app.use('/api/productos', productosRouter);

// Socket.IO
io.on('connection', (socket) => {
  console.log('Cliente conectado a Socket.IO');
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
