require("dotenv").config();
const mongoose = require("mongoose");
const conn = require("../config/db"); // usa sua config real

const clearDatabase = async () => {
  try {
    await conn();

    console.log("⚠️ Apagando banco...");

    await mongoose.connection.dropDatabase();

    console.log("✅ Banco zerado com sucesso!");

    await mongoose.disconnect();
  } catch (err) {
    console.error("Erro:", err);
  }
};

if (require.main === module) {
  clearDatabase().then(() => process.exit(0));
}