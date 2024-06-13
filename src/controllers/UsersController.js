const { hash, compare } = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const db = require("../database/knex");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "BOLACHA";

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;

    // TRATAMENTO DE ERROS
    if (name === undefined || email === undefined || password === undefined) {
      return res.status(400).send({ message: "Por favor, preencha todos os campos.", error: true });
    }

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

    const createdId = uuidv4();

    //CRIA O USUARIO
    await db("users").insert({
      id: createdId, // Gera um UUID
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ id: createdId }, SECRET_KEY, { expiresIn: "1h" });
    return res.json({ message: "Usuario criado com sucesso!", error: false, token });
    /* 
    res.status(201).json({ message: "Usuario criado com sucesso", error: false, data: { name, email } }); */
  }

  async login(req, res) {
    const { email, password } = req.body;

    // VERIFICA SE O USUARIO EXISTE NO DB
    const user = await db("users").where({ email }).first();
    if (!user) {
      return res.status(400).send({ message: "Usuario não existe, por favor crie uma conta", error: true });
    }
    if (password.length < 6) {
      return res.status(400).send({ message: "A senha precisa ter pelo menos 6 caracters", error: true });
    }

    const comparedPassword = await compare(password, user.password);

    if (comparedPassword && user.email === email) {
      const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
      return res.json({ message: "Login feito com sucesso!", error: false, token });
    } else {
      return res.status(400).send({ message: "Senha incorreta!!", error: true });
    }
  }

  async get(req, res) {
    const { id } = req.user;

    const user = await db("users").where({ id }).first();

    res.json(user);
  }

  async update(req, res) {
    const { name, email, actualPassword, newPassword } = req.body;
    const { id } = req.params;
    const user = await db("users").where({ id }).first();

    if (name === "" || email === "" || actualPassword === "") {
      return res.status(400).send({ message: "Por favor preencha todos os campos!! ", error: true });
    }
    const comparedPassword = await compare(actualPassword, user.password);

    if (comparedPassword) {
      if (newPassword === "") {
        const hashedPassword = await hash(actualPassword, 8);

        await db("users").where({ id }).update({ name, email, password: hashedPassword });
      } else {
        const hashedPassword = await hash(newPassword, 8);

        await db("users").where({ id }).update({ name, email, password: hashedPassword });
      }

      return res.status(400).send({ message: "Dados atualizados com sucesso!", error: false });
    } else {
      return res.status(400).send({ message: "Senha incorreta!", error: true });
    }
  }
}

module.exports = UsersController;
