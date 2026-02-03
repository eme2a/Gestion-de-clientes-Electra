const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/ping", (req, res) => {
  res.json({ ok: true });
});

app.listen(3000, () => {
  console.log("Servidor clientes-db escuchando en puerto 3000");
});
