const mongoose = require("mongoose");
const dotenv = require("dotenv");

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config();
}

const dbName = process.env.DB_NAME || "meuprojetobd";

const conn = async () => {
  try {
    const dbConn = await mongoose.connect(
      `mongodb://localhost:27017/${dbName}`
    );

    console.log(`Conectou ao banco local: ${dbName}`);
    return dbConn;
  } catch (error) {
    console.log("Erro ao conectar ao MongoDB local:", error);
  }
};

module.exports = conn;