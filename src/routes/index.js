const { Router } = require("express");
const userController = require("./user.routes.js");

const routes = Router();

routes.use("/users", userController);

module.exports = routes;
