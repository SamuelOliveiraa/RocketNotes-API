const { v4: uuidv4 } = require("uuid");

exports.up = knex =>
  knex.schema.createTable("notes", table => {
    table.uuid("id").primary();
    table.uuid("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.text("title");
    table.text("description");
    table.text("links").notNullable();
    table.text("tags").notNullable();
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  });

exports.down = knex => knex.schema.dropTable("notes");
