const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// DB en memoria (temporal)
let clientes = {};

// sanity check
app.get("/ping", (req, res) => {
  res.json({ ok: true });
});

// obtener todos los clientes
app.get("/clientes", (req, res) => {
  res.json(clientes);
});

// crear o actualizar cliente
app.post("/clientes", (req, res) => {
  const { nombre, datos } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: "Falta nombre" });
  }

  clientes[nombre] = {
    ...(clientes[nombre] || {}),
    ...datos,
    updated: new Date().toISOString(),
  };

  res.json({ ok: true, cliente: clientes[nombre] });
});

app.listen(3000, () => {
  console.log("Servidor clientes-db escuchando en puerto 3000");
});
