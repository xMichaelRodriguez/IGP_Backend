import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import io from "socket.io";

//Rutas
import authRouter from "./routes/auth.js";
import storiesRouter from "./routes/stories.js";
dotenv.config();

//database
import { dbConnection } from "./database/config.js";
import { connectionSocket } from "./controllers/sockets.js";

// Crear el servidor de express
const app = express();

http.Server(app);

// Base de datos
dbConnection();

// CORS
app.use(cors());

// Directorio Público
app.use(express.static("public"));

// Lectura y parseo del body
app.use(express.json());

//socket.io
connectionSocket(http, io);

// Rutas
app.use("/api/auth", authRouter);
app.use("/api/stories", storiesRouter);

// Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
