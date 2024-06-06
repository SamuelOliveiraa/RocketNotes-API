class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;

    // TRATAMENTO DE ERROS
    if (name === "" || email === "" || password === "") {
      return res.status(400).send({ message: "Por favor, preencha todos os campos.", error: true });
      /* return new Error("Por favor, preencha todos os campos."); */
    }

    // TRATAMENTO DE ERROS
    if (password.length < 6) {
      return res.status(400).send({ message: "A senha deve ter pelo menos 6 caracteres.", error: true });
      /* return new Error("A senha deve ter pelo menos 6 caracteres."); */
    }

    res.status(201).json({ message: "Usuario criado com sucesso", error: false, data: { name, email } });
  }
}

module.exports = UsersController;
