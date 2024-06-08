const { hash, compare } = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const db = require("../database/knex");

class NotesController {
  async create(req, res) {
    const { title, description, links, tags } = req.body;

    const { user_id } = req.params;

    // TRATAMENTO DE ERROS
    if (title === undefined || description === undefined || links === undefined || tags === undefined) {
      return res.status(400).send({ message: "Por favor, preencha todos os campos.", error: true });
    }

    // TRATAMENTO DE ERROS
    if (title === "" || description === "") {
      return res.status(400).send({ message: "Por favor, preencha todos os campos.", error: true });
    }

    // TRATAMENTO DE ERROS
    if (links.length === 0 || links.length === 0) {
      return res.status(400).send({ message: "Por favor, preencha pelo menos com um link e com uma tag", error: true });
    }
       
    
    //CRIA A NOTA
    const note = { 
      id: uuidv4(), // Gera um UUID
      user_id,
      title,
      description,
      links,
      tags
    };

    await db("notes").insert(note);

    res.status(201).json({ message: "Nota inserida com sucesso", error: false, data: note });
  }
}

module.exports = NotesController;
