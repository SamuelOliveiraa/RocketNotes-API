const { Router } = require("express");
const usersRoutes = require("./user.routes.js");
const notesRoutes = require("./notes.routes.js");

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/notes", notesRoutes);

module.exports = routes;
