const mongoose = require("mongoose");
const conn = require("../config/db");

beforeAll(async () => {
  await conn();
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
});