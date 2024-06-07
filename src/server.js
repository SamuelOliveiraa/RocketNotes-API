const express = require("express");
const app = express();
const port = 3333;
const routes = require("./routes");
const cors = require('cors');
const sqliteConnection = require("./database/sqlite");

// Configurar CORS
app.use(cors());

app.use(express.json());
app.use(routes);

sqliteConnection()

app.listen(port, () => console.log(`Server is runing on port ${port}`));
