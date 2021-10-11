const express = require('express')
// Crear el servidor de express
const app = express()
const server = require('http').createServer(app)

const dotenv = require('dotenv').config()
const cors = require('cors')
const corsOptions = {
  origin: 'https://uvs.netlify.app',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

//Rutas
const authRouter = require('./routes/auth.js')
const storiesRouter = require('./routes/stories')
const noticeRouter = require('./routes/notice')
const organizationRoute = require('./routes/organization')
//database
const { dbConnection } = require('./database/config.js')
const socket = require('./socket.js')

// Base de datos
dbConnection()

// CORS
app.use(cors())

// Lectura y parseo del body
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//socket.io
//socket.connect(server);

// Rutas
app.use('/api/auth', authRouter)
app.use('/api/stories', storiesRouter)
app.use('/api/noticies', noticeRouter)
app.use('/api/organizations', organizationRoute)

// Escuchar peticiones
server.listen(process.env.PORT, () => {
  console.log(
    `Servidor corriendo en puerto ${process.env.PORT}`
  )
})
