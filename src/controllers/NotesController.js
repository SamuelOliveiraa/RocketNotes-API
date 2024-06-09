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
    if (links.length === 0 || tags.length === 0) {
      return res.status(400).send({ message: "Por favor, preencha pelo menos com um link e com uma tag", error: true });
    }
    const allLinks = JSON.stringify(links);
    const allTags = JSON.stringify(tags);
    //CRIA A NOTA
    const note = {
      id: uuidv4(), // Gera um UUID
      user_id,
      title,
      description,
      links: allLinks,
      tags: allTags
    };

    await db("notes").insert(note);

    res.status(201).json({ message: "Nota inserida com sucesso", error: false, data: note });
  }

  async get(req, res) {
    const { user_id } = req.params;

    const notes = await db("notes").where({ user_id });

    notes.map(note => {
      note.links = JSON.parse(note.links);
      note.tags = JSON.parse(note.tags);
    });

    res.json(notes);
  }

  async getById(req, res) {
    const { id } = req.params;

    const note = await db("notes").where({ id }).first();

    note.links = JSON.parse(note.links);
    note.tags = JSON.parse(note.tags);

    res.json(note);
  }

  async search(req, res) {
    const { text } = req.params;

    const notes = await db("notes").where("title", "like", `%${text}%`).orWhere("description", "like", `%${text}%`).orWhere("tags", "like", `%${text}%`);

    notes.map(note => {
      note.links = JSON.parse(note.links);
      note.tags = JSON.parse(note.tags);
    });

    res.send(notes);
  }

  async delete(req, res) {
    const { id } = req.params;

    await db("notes").where({ id }).delete();

    res.status(204).json({ message: "Nota excluída com sucesso", error: false });
  }
}

module.exports = NotesController;
