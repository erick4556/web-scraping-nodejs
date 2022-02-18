const express = require("express");
const mongoose = require("mongoose");
const housesRouter = require("./api/houses/houses.routes");

mongoose.connect("mongodb://localhost:27017/trip", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", (err) => {
  console.log("Error de conexión", err);
  process.exit(1); //El script se ejecutó pero terminó en error
});

const app = express();
const port = 3000;

app.use("/api/houses", housesRouter);

app.listen(port, () => console.log("Esuchando en el puerto", port));
