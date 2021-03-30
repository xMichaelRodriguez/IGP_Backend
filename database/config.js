import mongoose from "mongoose";
export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log("DB Online");
  } catch (error) {
    throw new Error("Error a la hora de inicializar la BD");
  }
};

export default {
  dbConnection,
};
