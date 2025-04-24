import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'localhost',    // Dirección del servidor MySQL
  port: 8000,           // Puerto donde escucha MySQL
  user: 'root',         // Usuario de MySQL
  password: 'root',     // Contraseña de MySQL
  database: 'stock_reventa' // Base de datos
});

console.log('✅ Conectado a la base de datos');

export default connection;
