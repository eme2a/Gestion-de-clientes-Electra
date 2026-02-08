const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = "/data";
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const db = new sqlite3.Database("/data/clientes.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS clientes (
      nombre TEXT PRIMARY KEY,
      datos TEXT,
      updated TEXT
    )
  `);
});

/* ===== SANITY ===== */
app.get("/ping", (req, res) => {
  res.json({ ok: true });
});

/* ===== GET TODOS (ARRAY) ===== */
app.get("/clientes", (req, res) => {
  db.all("SELECT * FROM clientes ORDER BY nombre", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const clientes = rows.map(r => ({
      nombre: r.nombre,
      ...JSON.parse(r.datos || "{}"),
      updated: r.updated
    }));

    res.json(clientes);
  });
});

/* ===== GET UNO ===== */
app.get("/clientes/:nombre", (req, res) => {
  db.get(
    "SELECT * FROM clientes WHERE nombre = ?",
    [req.params.nombre],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "No encontrado" });

      res.json({
        nombre: row.nombre,
        ...JSON.parse(row.datos || "{}"),
        updated: row.updated
      });
    }
  );
});

/* ===== CREATE / UPDATE ===== */
app.post("/clientes", (req, res) => {
  const { nombre, ...datos } = req.body;
  if (!nombre) return res.status(400).json({ error: "Falta nombre" });

  const updated = new Date().toISOString();

  db.run(
    `
    INSERT INTO clientes (nombre, datos, updated)
    VALUES (?, ?, ?)
    ON CONFLICT(nombre) DO UPDATE SET
      datos = excluded.datos,
      updated = excluded.updated
    `,
    [nombre, JSON.stringify(datos), updated],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true });
    }
  );
});

/* ===== DELETE ===== */
app.delete("/clientes/:nombre", (req, res) => {
  db.run(
    "DELETE FROM clientes WHERE nombre = ?",
    [req.params.nombre],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true });
    }
  );
});

app.listen(3000, () => {
  console.log("Clientes-db OK en puerto 3000");
});
