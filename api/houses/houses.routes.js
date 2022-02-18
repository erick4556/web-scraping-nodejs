const express = require("express");
const housesRouter = express.Router();
const houseController = require("./house.controller");

housesRouter.get("/", async (req, res) => {
  try {
    const response = await houseController.getData(req.query);

    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

module.exports = housesRouter;
