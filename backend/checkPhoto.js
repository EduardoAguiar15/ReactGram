const mongoose = require("mongoose");
const Photo = require("./models/Photo");
require("dotenv").config();

const dbName = process.env.DB_NAME || "meuprojetobd";

const conn = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/${dbName}`);
    console.log("Conectou ao banco!");

    const result = await Photo.updateMany({}, { $set: { comments: [] } });
    console.log(`Comentários apagados de ${result.modifiedCount} fotos.`);

    mongoose.disconnect();
  } catch (error) {
    console.error(error);
  }
};

conn();