const { hash, compare } = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const db = require("../database/knex");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "BOLACHA";

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;

    // TRATAMENTO DE ERROS
    if (name === "" || email === "" || password === "") {
      return res.status(400).send({ message: "Por favor, preencha todos os campos.", error: true });
    }

    // TRATAMENTO DE ERROS
    if (password.length < 6) {
      return res.status(400).send({ message: "A senha deve ter pelo menos 6 caracteres.", error: true });
    }

    // CHECA SE O E-MAIL JÁ EXISTE
    const checkIfUserExists = await db("users").where({ email }).first();
    if (checkIfUserExists) {
      res.status(406).send({ message: "E-mail já esta em uso", error: true });
      return new Error("E-mail já esta em uso");
    }

    // CRIPTOGRAFA A SENHA DO USUARIO
    const hashedPassword = await hash(password, 8);

    //CRIA O USUARIO
    await db("users").insert({
      id: uuidv4(), // Gera um UUID
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: "Usuario criado com sucesso", error: false, data: { name, email } });
  }

  async login(req, res) {
    const { email, password } = req.body;

    // VERIFICA SE O USUARIO EXISTE NO DB
    const user = await db("users").where({ email }).first();
    if (!user) {
      return res.status(400).send({ message: "Usuario não existe, por favor crie uma conta", error: true });
    }

    const comparedPassword = await compare(password, user.password);

    if (comparedPassword && user.email === email) {
      const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
      return res.json({ message: "Login feito com sucesso!", error: false, token });
    } else {
      return res.status(400).send({ message: "A senha ou o e-mail não conferem", error: true });
    }
  }

  async get(req, res) {
    const { id } = req.user;

    const user = await db("users").where({ id }).first();

    res.json(user);
  }
}

module.exports = UsersController;
