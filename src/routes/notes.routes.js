const { Router } = require("express");
const NotesController = require("../controllers/NotesController");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "BOLACHA";
const notesRoutes = Router();

const notesController = new NotesController();

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

notesRoutes.post("/:user_id", notesController.create);
notesRoutes.get("/:user_id", authenticateJWT, notesController.get);
notesRoutes.get("/search/:text", authenticateJWT, notesController.search);
notesRoutes.get("/note/:id", authenticateJWT, notesController.getById);
notesRoutes.delete("/note/:id", authenticateJWT, notesController.delete);

module.exports = notesRoutes;
