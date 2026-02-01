// tests/setup.js
const mongoose = require("mongoose");
const conn = require("../config/db"); // ou ../db.js, dependendo da pasta

beforeAll(async () => {
  await conn(); // conecta usando db.js
});

afterEach(async () => {
  await require("mongoose").connection.db.dropDatabase(); // limpa banco de teste
});

afterAll(async () => {
  await mongoose.connection.close(); // ou mongoose.disconnect()
});