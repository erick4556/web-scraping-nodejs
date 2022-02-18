const mongoose = require("mongoose");
const House = require("../api/houses/houses.model");

mongoose.connect("mongodb://localhost:27017/trip", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", (err) => {
  console.log("Error de conexión", err);
  process.exit(1); //El script se ejecutó pero terminó en error
});

const saveHouse = async (houses) => {
  for (const house of houses) {
    try {
      await new House(house).save();
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = {
  saveHouse,
};
