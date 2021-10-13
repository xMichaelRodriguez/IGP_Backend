const express = require('express');
// Crear el servidor de express
const app = express();
const server = require('http').createServer(app);
// const morgan = require('morgan');
const dotenv = require('dotenv').config();
const cors = require('cors');
const whiteList = [
  'https://uvs.netlify.app',
  'http://localhost:3000',
  'http://localhost:4000',
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
// app.use(morgan('dev'))

// Lectura y parseo del body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//socket.io
//socket.connect(server);

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/noticies', noticeRouter);
app.use('/api/organizations', organizationRoute);
app.use('/api/commics', commicsRoute);

// Escuchar peticiones
server.listen(process.env.PORT, () => {
  console.log(
    `Servidor corriendo en puerto ${process.env.PORT}`
  );
});
