const express = require('express');
const socketIo = require('socket.io')
const morgan =require('morgan')
// Crear el servidor de express
const app = express();
const server = require('http').createServer(app);

// config
require('dotenv').config();
const cors = require('cors');
const whiteList = [
  'https://uvs.netlify.app',
  'http://localhost:5000',
  'http://localhost:4000',
   'http://192.168.1.5:3000',
  'http://localhost:3000',
];
const corsOptions = {
  origin: whiteList,
};

//Rutas
const authRouter = require('./routes/auth.js');
const storiesRouter = require('./routes/stories');
const noticeRouter = require('./routes/notice');
const organizationRoute = require('./routes/organization');
const commicsRoute = require('./routes/commics');
//database
const { dbConnection } = require('./database/config.js');
const socket = require('./socket.js');

// Base de datos
dbConnection();

// CORS
app.use(cors(corsOptions));
const io = socketIo(server, {
  cors: {
    corsOptions, methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
})


// Lectura y parseo del body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'))


// Rutas
app.use('/api/auth', authRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/noticies', noticeRouter);
app.use('/api/organizations', organizationRoute);
app.use('/api/commics', commicsRoute);


// sockets
io.on('connection', socket => {
  require('./socket').listen(io, socket)
})


// Escuchar peticiones
server.listen(process.env.PORT, () => {
  console.log(
    `Servidor corriendo en puerto ${process.env.PORT}`
  );
});
