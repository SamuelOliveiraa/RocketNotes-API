const { Router } = require("express");
const UsersController = require("../controllers/UsersController");

const jwt = require("jsonwebtoken");
const SECRET_KEY = "BOLACHA";

const usersRoutes = Router();

const usersController = new UsersController();

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).send({ message: "Token inválido, você não tem acesso a esta rota", error: true });
      }
      req.user = user;
      next(); // Passa para a próxima função middleware/rota
    });
  } else {
    return res.status(401).send({ message: "Nenhum token foi fornecido, você não tem acesso a esta rota", error: true });
  }
};

usersRoutes.post("/", usersController.create);
usersRoutes.post("/login", usersController.login);

usersRoutes.get("/", authenticateJWT, usersController.get);
usersRoutes.put("/:id", authenticateJWT, usersController.update);

module.exports = usersRoutes;
