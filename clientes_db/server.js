const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// aseguramos carpeta persistente
const DATA_DIR = "/data";
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// base sqlite persistente
const db = new sqlite3.Database("/data/clientes.db");

// tabla
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS clientes (
      nombre TEXT PRIMARY KEY,
      datos TEXT,
      updated TEXT
    )
  `);
});

// sanity
app.get("/ping", (req, res) => {
  res.json({ ok: true });
});

// obtener todos
app.get("/clientes", (req, res) => {
  db.all("SELECT * FROM clientes", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const out = {};
    rows.forEach(r => {
      out[r.nombre] = {
        ...JSON.parse(r.datos),
        updated: r.updated
      };
    });

    res.json(out);
  });
});

// crear / actualizar
app.post("/clientes", (req, res) => {
  const { nombre, datos } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: "Falta nombre" });
  }

  const updated = new Date().toISOString();

  db.run(
    `
    INSERT INTO clientes (nombre, datos, updated)
    VALUES (?, ?, ?)
    ON CONFLICT(nombre) DO UPDATE SET
      datos = excluded.datos,
      updated = excluded.updated
    `,
    [nombre, JSON.stringify(datos || {}), updated],
    err => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ ok: true });
    }
  );
});

app.listen(3000, () => {
  console.log("Servidor clientes-db escuchando en puerto 3000");
});
