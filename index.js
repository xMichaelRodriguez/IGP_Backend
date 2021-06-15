const express = require('express');
// Crear el servidor de express
const app = express();
const server = require('http').createServer(app);

const dotenv = require('dotenv').config();
const cors = require('cors');

//Rutas
const authRouter = require('./routes/auth.js');
const storiesRouter = require('./routes/stories');
const noticeRouter = require('./routes/notice');
//database
const { dbConnection } = require('./database/config.js');
const socket = require('./socket.js');

// Base de datos
dbConnection();

// CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

//socket.io
//socket.connect(server);

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/noticies', noticeRouter);

// Escuchar peticiones
server.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
