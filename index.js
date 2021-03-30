import express from "express";
import dotenv from "dotenv";
import cors from "cors";

//Rutas
import authRouter from "./routes/auth.js";
import storiesRouter from "./routes/stories.js";
dotenv.config();

//database
import { dbConnection } from "./database/config.js";

// Crear el servidor de express
const app = express();

// Base de datos
dbConnection();

// CORS
app.use(cors());

// Directorio Público
app.use(express.static("public"));

// Lectura y parseo del body
app.use(express.json());

// Rutas
app.use("/api/auth", authRouter);
app.use("/api/stories", storiesRouter);

// Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
